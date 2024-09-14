package routes

import (
	"chitchat/controllers"
	"chitchat/middlewares"
	"chitchat/ws"
	"net/http"

	"github.com/gorilla/mux"
)

func Router() *mux.Router {
	router := mux.NewRouter()
	// http.Handle("/", middlewares.CorsMiddleware(router))

	router.HandleFunc("/", controllers.HomeHandler).Methods("GET")
	router.HandleFunc("/signup", controllers.Signup).Methods("POST")
	router.HandleFunc("/login", controllers.Login).Methods("POST")

	// Secured Routes
	router.Handle("/logout", middlewares.VerifyJWT(http.HandlerFunc(controllers.Logout))).Methods("POST")
	router.Handle("/send/{id}", middlewares.VerifyJWT(http.HandlerFunc(controllers.SendMessage))).Methods("POST")
	router.Handle("/{id}", middlewares.VerifyJWT(http.HandlerFunc(controllers.GetMessage))).Methods("GET")

	// User routes
	router.Handle("/get/users", middlewares.VerifyJWT(http.HandlerFunc(controllers.GetUsers))).Methods("GET")

	// Add Websocket route
	router.HandleFunc("/ws/{id}", ws.HandleWS)

	return router
}
