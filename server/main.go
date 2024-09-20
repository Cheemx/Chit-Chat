package main

import (
	"chitchat/db"
	"chitchat/routes"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"
)

func init() {
	// er := godotenv.Load()

	// if er != nil {
	// 	log.Fatalf("Error in loading env %v", er)
	// }
	db.ConnectDB()
}

func main() {
	r := routes.Router()
	port := os.Getenv("PORT")

	if port == "" {
		port = ":8080"
	}
	fmt.Println("Server is getting started ...")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"X-Requested-With", "Content-Type", "Authorization"},
	})

	handler := c.Handler(r)

	fmt.Printf("Listening at %v\n", port)
	log.Fatal(http.ListenAndServe(port, handler))
}
