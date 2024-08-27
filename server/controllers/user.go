package controllers

import (
	"chitchat/db"
	"chitchat/model"
	"chitchat/utils"
	"context"
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
)

func GetUsers(w http.ResponseWriter, r *http.Request) {
	// Retrieve the user from context (set by auth middleware)
	loggedInUser, ok := r.Context().Value("user").(*model.User)
	if !ok || loggedInUser == nil {
		http.Error(w, "Unauthorized Request", http.StatusUnauthorized)
		return
	}

	// get all users' cursor from db other than currently logged in one
	filter := bson.M{"_id": bson.M{"$ne": loggedInUser.ID}}

	usersCursor, findErr := db.UserCollection.Find(context.TODO(), filter)
	if findErr != nil {
		http.Error(w, "Error in getting all users: "+findErr.Error(), http.StatusInternalServerError)
		return
	}

	// getting all documents off from users' cursor
	var results []model.User
	docErr := usersCursor.All(context.TODO(), &results)
	if docErr != nil {
		http.Error(w, "Error while extracting userCursor: "+docErr.Error(), http.StatusInternalServerError)
		return
	}

	res := utils.ApiResponse{
		StatusCode: http.StatusOK,
		Data:       results,
		Message:    "List of all the users",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
