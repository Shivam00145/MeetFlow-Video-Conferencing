CREATE TABLE `history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`meetingCode` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `history` ADD CONSTRAINT `history_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;