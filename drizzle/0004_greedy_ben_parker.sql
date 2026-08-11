CREATE TABLE `activity_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_type` text NOT NULL,
	`message` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
