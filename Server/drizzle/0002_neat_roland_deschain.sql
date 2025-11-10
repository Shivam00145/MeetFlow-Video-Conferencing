CREATE TABLE `contact-messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact-messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `contact-messages` ADD CONSTRAINT `contact-messages_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;