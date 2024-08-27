package model

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID           primitive.ObjectID  `bson:"_id,omitempty" json:"_id,omitempty"`
	FullName     string              `bson:"fullName" json:"fullName" validate:"required"`
	Email        string              `bson:"email" json:"email" validate:"required"`
	Username     string              `bson:"userName" json:"userName" validate:"required"`
	Password     string              `bson:"password" json:"password" validate:"required"`
	Gender       string              `bson:"gender" json:"gender" validate:"required,oneof=Male Female Other"`
	ProfilePic   string              `bson:"profilePic" json:"profilePic"`
	RefreshToken string              `bson:"refreshToken" json:"refreshToken"`
	CreatedAt    time.Time           `bson:"createdAt" json:"createdAt" validate:"required"`
	UpdatedAt    primitive.Timestamp `bson:"updatedAt" json:"updatedAt" validate:"required"`
}

// GenerateAccessToken to create a JWT Access Token
func (u *User) GenerateAccessToken() (string, error) {
	claims := jwt.MapClaims{
		"userId": u.ID,
		"exp":    time.Now().Add(time.Hour * 24).Unix(),
		"jti":    primitive.NewObjectID().Hex(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	accessSecret := os.Getenv("ACCESS_TOKEN_SECRET")

	return token.SignedString([]byte(accessSecret))
}

func (u *User) GenerateRefreshToken() (string, error) {
	claims := jwt.MapClaims{
		"userId": u.ID,
		"exp":    time.Now().Add(time.Hour * 24 * 10).Unix(),
		"jti":    primitive.NewObjectID().Hex(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	refreshSecret := os.Getenv("REFRESH_TOKEN_SECRET")

	return token.SignedString([]byte(refreshSecret))
}
