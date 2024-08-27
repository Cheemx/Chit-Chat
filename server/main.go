package main

import (
	"chitchat/db"
	"chitchat/routes"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func init() {
	er := godotenv.Load()

	if er != nil {
		log.Fatalf("Error in loading env %v", er)
	}
	db.ConnectDB()
}

func main() {
	r := routes.Router()
	port := os.Getenv("PORT")

	if port == "" {
		port = ":8080"
		log.Fatal("Error in parsing the env")
	}
	fmt.Println("Server is getting started ...")

	fmt.Printf("Listening at %v\n", port)
	log.Fatal(http.ListenAndServe(port, r))
}
