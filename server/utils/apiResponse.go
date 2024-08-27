package utils

type ApiResponse struct {
	StatusCode int         `json:"statusCode"`
	Data       interface{} `json:"data"`
	Message    string      `json:"message"`
}
