package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	SenderID    primitive.ObjectID  `bson:"senderId" json:"senderId" validate:"required"`
	ReceiverID  primitive.ObjectID  `bson:"receiverId" json:"receiverId" validate:"required"`
	MessageBody string              `bson:"message" json:"message" validate:"required"`
	Type        string              `bson:"type" json:"type"`
	FileURL     string              `bson:"fileUrl,omitempty" json:"fileUrl,omitempty"`
	FileType    string              `bson:"fileType,omitempty" json:"fileType,omitempty"`
	CreatedAt   time.Time           `bson:"createdAt" json:"createdAt" validate:"required"`
	UpdatedAt   primitive.Timestamp `bson:"updatedAt" json:"updatedAt" validate:"required"`
}
