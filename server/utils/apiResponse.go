package utils

type ApiResponse struct {
	StatusCode int         `json:"status"`
	Data       interface{} `json:"data"`
	Message    string      `json:"message"`
}
