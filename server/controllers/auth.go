package controllers

import (
	"chitchat/db"
	"chitchat/model"
	"chitchat/utils"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func generateAccessAndRefreshTokens(userId string) (map[string]string, error) {
	objId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return nil, errors.New("invalid user id")
	}

	var user model.User
	filter := bson.M{"_id": objId}
	findErr := db.UserCollection.FindOne(context.Background(), filter).Decode(&user)
	if findErr != nil {
		return nil, errors.New("user not found")
	}

	accessToken, accessErr := user.GenerateAccessToken()
	if accessErr != nil {
		return nil, errors.New("failed to create access token")
	}

	refreshToken, refreshErr := user.GenerateRefreshToken()
	if refreshErr != nil {
		return nil, errors.New("failed to create refresh token")
	}

	update := bson.M{"$set": bson.M{"refreshToken": refreshToken}}
	_, updateErr := db.UserCollection.UpdateOne(context.Background(), filter, update)
	if updateErr != nil {
		return nil, errors.New("failed to update refresh token")
	}

	return map[string]string{
		"accessToken":  accessToken,
		"refreshToken": refreshToken,
	}, nil
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if err := recover(); err != nil {
			http.Error(w, "Didn't reach homepage", http.StatusBadRequest)
		}
	}()

	res := utils.ApiResponse{
		StatusCode: http.StatusOK,
		Data:       map[string]interface{}{},
		Message:    "Welcome to Homepage",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err := json.NewEncoder(w).Encode(res)

	if err != nil {
		panic(err)
	}
}

func Signup(w http.ResponseWriter, r *http.Request) {
	// setting headers
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Methods", "POST")

	// get the data from request body and inject into the user (it is an instance of User model)
	var user model.User
	e := json.NewDecoder(r.Body).Decode(&user)

	if e != nil {
		http.Error(w, "Error in extracting request body", http.StatusBadRequest)
		fmt.Println("Error in extracting request body")
		return
	}

	// check if the user already exists
	filter := bson.M{"email": user.Email}
	var existingUser model.User
	err := db.UserCollection.FindOne(context.TODO(), filter).Decode(&existingUser)

	if err != mongo.ErrNoDocuments {
		http.Error(w, "The User already exists", http.StatusBadRequest)
		fmt.Println("The User already exists")
		return
	}

	// Hash the password
	hashedPass, ero := bcrypt.GenerateFromPassword([]byte(user.Password), 10)

	if ero != nil {
		http.Error(w, "Error while hashing password", http.StatusInternalServerError)
		return
	}
	user.Password = string(hashedPass)

	user.CreatedAt = time.Now()
	user.UpdatedAt = primitive.Timestamp{T: uint32(time.Now().Unix())}

	// Create the user
	_, eror := db.UserCollection.InsertOne(context.TODO(), user)

	if eror != nil {
		http.Error(w, "Error while inserting the data in db", http.StatusInternalServerError)
		return
	}

	res := utils.ApiResponse{
		StatusCode: http.StatusOK,
		Data:       user,
		Message:    "User created Successfully",
	}

	// return the response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}

func Login(w http.ResponseWriter, r *http.Request) {
	// setting headers
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Methods", "POST")

	// get the email and pass off request body
	var body model.User
	errorDecode := json.NewDecoder(r.Body).Decode(&body)

	if errorDecode != nil {
		http.Error(w, "Error while decoding request", http.StatusBadRequest)
		return
	}

	// Look up for requested user
	filter := bson.M{"email": body.Email}
	var user model.User
	findError := db.UserCollection.FindOne(context.TODO(), filter).Decode(&user)

	if findError != nil {
		if errors.Is(findError, mongo.ErrNoDocuments) {
			http.Error(w, "No User Found", http.StatusUnauthorized)
			return
		}
		log.Println(errorDecode)
		http.Error(w, "Something went wrong while logging in", http.StatusInternalServerError)
		return
	}

	// match the passwords incoming and existing
	incorrectPass := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))

	if incorrectPass != nil {
		http.Error(w, "Invalid User Credentials", http.StatusBadRequest)
		return
	}

	// provide cookies
	tokens, genErr := generateAccessAndRefreshTokens(user.ID.Hex())
	if genErr != nil {
		log.Fatal(genErr)
		http.Error(w, "Error while generating refresh & access tokens", http.StatusInternalServerError)
	}

	access := http.Cookie{
		Name:     "Access",
		Value:    tokens["accessToken"],
		MaxAge:   3600 * 24,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	}

	refresh := http.Cookie{
		Name:     "Refresh",
		Value:    tokens["refreshToken"],
		MaxAge:   3600 * 24 * 10,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	}

	http.SetCookie(w, &access)
	http.SetCookie(w, &refresh)

	res := utils.ApiResponse{
		StatusCode: http.StatusOK,
		Data:       user,
		Message:    "User Logged in successfully",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Retrieve the user from context (set by auth middleware)
	user, ok := r.Context().Value("user").(*model.User)
	if !ok || user == nil {
		http.Error(w, "Unauthorized Request", http.StatusUnauthorized)
		return
	}

	// Remove the refreshToken from the user's document in the database
	filter := bson.M{"_id": user.ID}
	update := bson.M{"$unset": bson.M{"refreshToken": 1}}
	_, updateError := db.UserCollection.UpdateOne(context.Background(), filter, update)

	if updateError != nil {
		http.Error(w, "Failed to Logout User", http.StatusInternalServerError)
		return
	}

	// clear cookies
	http.SetCookie(w, &http.Cookie{
		Name:     "accessToken",
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refreshToken",
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})

	res := utils.ApiResponse{
		StatusCode: http.StatusOK,
		Message:    "User Logged Out Successfully",
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
