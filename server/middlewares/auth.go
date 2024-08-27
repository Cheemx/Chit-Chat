package middlewares

import (
	"chitchat/db"
	"chitchat/model"
	"context"
	"errors"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func VerifyJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Trying to get off the auth header which I definitely never set
		tokenStr := r.Header.Get("Authorization")

		// If token is found in the authorization header, extract it
		if tokenStr != "" && strings.HasPrefix(tokenStr, "Bearer ") {
			tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")
		} else {
			// try to get tokens from cookies
			cookie, cookieerror := r.Cookie("Access")
			if cookieerror == nil {
				tokenStr = cookie.Value
			}
		}

		if tokenStr == "" {
			http.Error(w, "Unauthorized Request", http.StatusUnauthorized)
			return
		}

		// Parse and Validate JWT (accessToken)
		token, tokenError := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			_, ok := t.Method.(*jwt.SigningMethodHMAC)
			if !ok {
				return nil, errors.New("invalid token signing method")
			}
			return []byte(os.Getenv("ACCESS_TOKEN_SECRET")), nil
		})

		if tokenError != nil || !token.Valid {
			http.Error(w, "Invalid Access Token", http.StatusUnauthorized)
			return
		}

		// grabbing the cookie fields that we set for getting userID
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			http.Error(w, "Invalid Access Token", http.StatusUnauthorized)
			return
		}

		// Get the ID of user, token of whom we have extracted
		userID, idError := primitive.ObjectIDFromHex(claims["userId"].(string))
		if idError != nil {
			http.Error(w, "Invalid Access Token", http.StatusUnauthorized)
			return
		}

		// Fetch the user from database
		var user model.User
		filter := bson.M{"_id": userID}
		findErr := db.UserCollection.FindOne(context.Background(), filter).Decode(&user)
		if findErr != nil {
			http.Error(w, "User not found", http.StatusUnauthorized)
			return
		}

		// Attach the user to the request context
		ctx := context.WithValue(r.Context(), "user", &user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})

}
