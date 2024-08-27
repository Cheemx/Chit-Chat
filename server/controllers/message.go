package controllers

import (
	"chitchat/db"
	"chitchat/model"
	"chitchat/utils"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func SendMessage(w http.ResponseWriter, r *http.Request) {
	// setting headers
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Methods", "POST")

	// getting the params off from request
	vars := mux.Vars(r)
	recId := vars["id"]

	if recId == "" {
		http.Error(w, "error in parsing parameters from request", http.StatusBadRequest)
		return
	}

	// converting string Id to primitive
	receiverId, err := primitive.ObjectIDFromHex(recId)
	if err != nil {
		http.Error(w, "Invalid receiver ID", http.StatusBadRequest)
		return
	}

	// getting the message off from request
	var message model.Message
	decodeError := json.NewDecoder(r.Body).Decode(&message)

	if decodeError != nil {
		http.Error(w, "Error while decoding request"+decodeError.Error(), http.StatusBadRequest)
		return
	}

	// Retrieve the user from context (set by auth middleware)
	sender, ok := r.Context().Value("user").(*model.User)
	if !ok || sender == nil {
		http.Error(w, "Unauthorized Request", http.StatusUnauthorized)
		return
	}

	// inserting the message into db
	message.SenderID = sender.ID
	message.ReceiverID = receiverId
	message.CreatedAt = time.Now()
	message.UpdatedAt = primitive.Timestamp{T: uint32(time.Now().Unix())}

	// Insert the message into the MessageCollection
	_, insertError := db.MessageCollection.InsertOne(context.TODO(), message)
	if insertError != nil {
		http.Error(w, "Error while inserting message: "+insertError.Error(), http.StatusInternalServerError)
		return
	}

	// checking if the convo exists already
	filter := bson.M{
		"participants": bson.M{
			"$all": []interface{}{sender.ID, receiverId},
		},
	}

	var convo model.Conversation
	findConvoError := db.ConvoCollection.FindOne(context.TODO(), filter).Decode(&convo)

	if findConvoError != nil {
		if errors.Is(findConvoError, mongo.ErrNoDocuments) {
			// If no conversation exists, creating a new one
			convo.Participant = []primitive.ObjectID{sender.ID, receiverId}
			convo.Message = []model.Message{message}
			convo.CreatedAt = time.Now()
			convo.UpdatedAt = primitive.Timestamp{T: uint32(time.Now().Unix())}

			_, insertConvoError := db.ConvoCollection.InsertOne(context.TODO(), convo)
			if insertConvoError != nil {
				http.Error(w, "Error while creating a new conversation: "+insertConvoError.Error(), http.StatusInternalServerError)
				return
			}
		} else {
			http.Error(w, "Error while checking for existing conversation: "+findConvoError.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		// If the conversation already exists, update it with the new message
		update := bson.M{
			"$push": bson.M{
				"messages": message,
			},
			"$set": bson.M{
				"updatedAt": primitive.Timestamp{T: uint32(time.Now().Unix()), I: 1},
			},
		}

		_, updateError := db.ConvoCollection.UpdateOne(context.TODO(), filter, update)
		if updateError != nil {
			http.Error(w, "Error while updating the conversation with the new message: "+updateError.Error(), http.StatusInternalServerError)
			return
		}
	}

	// send response of success
	res := utils.ApiResponse{
		StatusCode: http.StatusOK,
		Data:       message,
		Message:    "sendMessage working fine!",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}

func GetMessage(w http.ResponseWriter, r *http.Request) {
	// Setting headers
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Methods", "GET")

	// Extracting parameters from request
	vars := mux.Vars(r)
	userToChat := vars["id"]

	if userToChat == "" {
		http.Error(w, "error in parsing parameters from request", http.StatusBadRequest)
		return
	}

	// Converting string ID to primitive.ObjectID
	userToChatId, err := primitive.ObjectIDFromHex(userToChat)
	if err != nil {
		http.Error(w, "Invalid UserToChat ID", http.StatusBadRequest)
		return
	}

	// Retrieving the receiver (user) from context (set by auth middleware)
	receiver, ok := r.Context().Value("user").(*model.User)
	if !ok || receiver == nil {
		http.Error(w, "Unauthorized Request", http.StatusUnauthorized)
		return
	}

	// checking if the convo exists already
	filter := bson.M{
		"participants": bson.M{
			"$all": []interface{}{userToChatId, receiver.ID},
		},
	}

	var convo model.Conversation
	findConvoError := db.ConvoCollection.FindOne(context.TODO(), filter).Decode(&convo)

	if findConvoError != nil {
		if errors.Is(findConvoError, mongo.ErrNoDocuments) {
			http.Error(w, "No conversation found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error while retrieving conversation: "+findConvoError.Error(), http.StatusInternalServerError)
		return
	}

	// getting the message off from convo
	msg := convo.Message

	// Sending response
	res := utils.ApiResponse{
		StatusCode: http.StatusOK,
		Data:       msg,
		Message:    "getMessage working fine!",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
