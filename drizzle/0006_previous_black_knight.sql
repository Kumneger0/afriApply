ALTER TABLE `users` ADD `verification_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_verification_id_unique` ON `users` (`verification_id`);