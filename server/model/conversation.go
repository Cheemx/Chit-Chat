package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Conversation struct {
	Participant []primitive.ObjectID `bson:"participants" json:"participants"`
	Message     []Message            `bson:"messages" json:"messages"`
	CreatedAt   time.Time            `bson:"createdAt" json:"createdAt" validate:"required"`
	UpdatedAt   primitive.Timestamp  `bson:"updatedAt" json:"updatedAt" validate:"required"`
}
