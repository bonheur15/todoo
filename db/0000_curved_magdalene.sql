-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255) DEFAULT 'NULL',
	`access_token` varchar(255) DEFAULT 'NULL',
	`expires_at` int(11) DEFAULT 'NULL',
	`token_type` varchar(255) DEFAULT 'NULL',
	`scope` varchar(255) DEFAULT 'NULL',
	`id_token` varchar(2048) DEFAULT 'NULL',
	`session_state` varchar(255) DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `authenticator` (
	`credentialID` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`credentialPublicKey` varchar(255) NOT NULL,
	`counter` int(11) NOT NULL,
	`credentialDeviceType` varchar(255) NOT NULL,
	`credentialBackedUp` tinyint(1) NOT NULL,
	`transports` varchar(255) DEFAULT 'NULL',
	CONSTRAINT `authenticator_credentialID_unique` UNIQUE(`credentialID`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL DEFAULT 'current_timestamp()'
);
--> statement-breakpoint
CREATE TABLE `todo` (
	`id` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`completed` tinyint(1) NOT NULL DEFAULT 0,
	`listId` varchar(255) NOT NULL,
	`createdAt` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`updatedAt` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)'
);
--> statement-breakpoint
CREATE TABLE `todo_list` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`createdAt` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`updatedAt` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)'
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) DEFAULT 'NULL',
	`email` varchar(255) DEFAULT 'NULL',
	`emailVerified` timestamp(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`image` varchar(255) DEFAULT 'NULL',
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verificationtoken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL DEFAULT 'current_timestamp()'
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `authenticator` ADD CONSTRAINT `authenticator_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `todo` ADD CONSTRAINT `todo_listId_todo_list_id_fk` FOREIGN KEY (`listId`) REFERENCES `todo_list`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `todo_list` ADD CONSTRAINT `todo_list_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;
*/