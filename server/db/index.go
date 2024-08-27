package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const dbName = "Chitchatter"
const userCollName = "User"
const messageCollName = "Message"
const convoCollName = "Conversation"

var UserCollection *mongo.Collection
var MessageCollection *mongo.Collection
var ConvoCollection *mongo.Collection

func ConnectDB() {
	connStr := os.Getenv("MONGODB_URI")

	if connStr == "" {
		log.Fatalf("Error getting the connection string")
	}

	// setting the options of database SRV
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	clientOptions := options.Client().ApplyURI(connStr).SetServerAPIOptions(serverAPI)

	// connecting to DB
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	client, err := mongo.Connect(ctx, clientOptions)
	defer cancel()

	if err != nil {
		log.Fatalf("Error connecting DB: %v", err)
	}

	userDB := client.Database(dbName)
	UserCollection = userDB.Collection(userCollName)
	MessageCollection = userDB.Collection(messageCollName)
	ConvoCollection = userDB.Collection(convoCollName)

	fmt.Println("Connected to Database!")
}
