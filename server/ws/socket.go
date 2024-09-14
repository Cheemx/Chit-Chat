package ws

import (
	"chitchat/db"
	"chitchat/model"
	"context"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// origin := r.Header.Get("Origin")
		return true // change this when the project is deployed
	},
}

var userSocketMap = make(map[string]*websocket.Conn)
var broadcast = make(chan model.Message)
var mutex sync.Mutex

func HandleWS(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial HTTP connection to WebSocket
	socket, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Println("Error upgrading to WebSocket:", err)
		return
	}
	defer socket.Close()

	vars := mux.Vars(r)
	userId := vars["id"]

	if userId != "" {
		mutex.Lock()
		// Registering new user
		userSocketMap[userId] = socket
		mutex.Unlock()
		log.Printf("User connected: %s with socket ID: %s\n", userId, socket.RemoteAddr())

		broadcastOnlineUsers()
	}

	for {
		var msg model.Message
		// Read new message as JSON and map it to msg object
		readErr := socket.ReadJSON(&msg)
		if readErr != nil {
			log.Printf("Error: %v", readErr)
			break
		}
		broadcast <- msg
	}

	mutex.Lock()
	delete(userSocketMap, userId)
	mutex.Unlock()
	broadcastOnlineUsers()
}

func broadcastOnlineUsers() {
	mutex.Lock()
	defer mutex.Unlock()

	onlineUsers := make([]string, 0, len(userSocketMap))
	for userId := range userSocketMap {
		onlineUsers = append(onlineUsers, userId)
	}

	for _, conn := range userSocketMap {
		err := conn.WriteJSON(onlineUsers)
		if err != nil {
			log.Printf("Error sending online users: %v\n", err)
		}
	}
}

func HandleMessages() {
	for {
		// grab next message from the broadcast channel
		msg := <-broadcast

		// Lock the mutex to ensure safe access to the userSocketMap
		mutex.Lock()
		receiverSocket, exists := userSocketMap[msg.ReceiverID.Hex()]
		mutex.Unlock()

		if exists {
			writeErr := receiverSocket.WriteJSON(msg)
			if writeErr != nil {
				log.Printf("Error sending message to user %s: %v\n", msg.ReceiverID, writeErr)
				receiverSocket.Close()
				mutex.Lock()
				delete(userSocketMap, msg.ReceiverID.Hex())
				mutex.Unlock()
			}
		} else {
			log.Printf("User %s is not connected\n", msg.ReceiverID)
			_, insertErr := db.MessageCollection.InsertOne(context.TODO(), msg)
			if insertErr != nil {
				log.Println("Error saving message:", insertErr)
			}
		}
	}
}
