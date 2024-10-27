package ws

import (
	"chitchat/model"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		return origin == "https://chit-chat-green.vercel.app" || origin == "http://localhost:5173"
	},
	EnableCompression: false,
}

type UserSocket struct {
	Conn     *websocket.Conn
	MsgQueue chan model.Message
}

var userSocketMap = make(map[string]*UserSocket)
var mutex sync.Mutex

func HandleWS(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial HTTP connection to WebSocket
	socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading to WebSocket:", err)
		return
	}
	log.Println("Websocket conn upgraded successfully")

	// Ping Pong Handler!
	pingTicker := time.NewTicker(1 * time.Minute)
	socket.SetPongHandler(func(appData string) error {
		log.Println("Pong received")
		return nil
	})

	go func() {
		for {
			<-pingTicker.C
			if err := socket.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				log.Println("Ping failed, closing connection:", err)
				socket.Close()
				break
			}
		}
	}()

	// Grab the user from context (Set by verifyJWT middleware)
	user, ok := r.Context().Value("user").(*model.User)
	if !ok || user == nil {
		http.Error(w, "Unauthorized Request", http.StatusUnauthorized)
		return
	}

	userId := user.ID.Hex()

	// vars := mux.Vars(r)
	// receiverId := vars["id"]

	ReadMessages(userId, socket)

	defer func() {
		pingTicker.Stop()
		mutex.Lock()
		delete(userSocketMap, userId)
		mutex.Unlock()
		log.Println("WebSocket connection closed.")
		socket.Close()
	}()
}

func HandleMessages(receiverId string, msg model.Message) {
	// Lock the mutex to ensure safe access to the userSocketMap
	mutex.Lock()
	receiver, exists := userSocketMap[receiverId]
	mutex.Unlock()

	if exists {
		// Add the message to the user's message queue
		receiver.MsgQueue <- msg
		log.Printf("Message queued for user %s\n", receiverId)
	} else {
		log.Printf("User %s is not connected. Message will only be saved on DB!\n", receiverId)
	}
}

// A separate function to handle sending messages sequentially for each user
func StartMessageWriter(userId string, socket *websocket.Conn) {
	msgQueue := make(chan model.Message, 100) // Buffered channel to hold queued messages

	userSocketMap[userId] = &UserSocket{
		Conn:     socket,
		MsgQueue: msgQueue,
	}

	// Goroutine to send messages from the queue
	go func() {
		for msg := range msgQueue {
			writeErr := socket.WriteJSON(msg)
			if writeErr != nil {
				log.Printf("Error sending message to user %s: %v\n", userId, writeErr)
				mutex.Lock()
				delete(userSocketMap, userId)
				mutex.Unlock()
				socket.Close()
				return
			}
			log.Printf("Message sent to User %s\n", userId)
		}
	}()
}

func ReadMessages(userId string, socket *websocket.Conn) {
	StartMessageWriter(userId, socket)

	defer func() {
		mutex.Lock()
		if userSocketMap[userId] != nil {
			close(userSocketMap[userId].MsgQueue)
		}
		delete(userSocketMap, userId)
		mutex.Unlock()
		log.Printf("User %s disconnected.\n", userId)
		socket.Close()
	}()

	for {
		var msg model.Message
		// Read new message as JSON and map it to msg object
		_, msgBytes, readErr := socket.ReadMessage()
		if readErr != nil {
			log.Printf("Error reading message for user %s: %v", userId, readErr)
			break
		}

		if err := json.Unmarshal(msgBytes, &msg); err != nil {
			log.Printf("Error unmarshalling message for user %s: %v", userId, err)
			continue
		}
		log.Printf("Message from user %s being inserted to channel: %v\n", msg.SenderID, msg)

		// Forward the message to the receiver
		HandleMessages(msg.ReceiverID.Hex(), msg)
	}
}
