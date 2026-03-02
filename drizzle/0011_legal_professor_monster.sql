CREATE TABLE `adminSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`token` varchar(500) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adminSessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `adminSessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `admins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`role` enum('super_admin','admin','editor') NOT NULL DEFAULT 'editor',
	`mfaEnabled` boolean NOT NULL DEFAULT false,
	`mfaMethod` enum('google_authenticator','sms','none') NOT NULL DEFAULT 'none',
	`phoneNumber` varchar(20),
	`lastLogin` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_username_unique` UNIQUE(`username`),
	CONSTRAINT `admins_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `mfaAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`attemptType` enum('totp','sms') NOT NULL,
	`success` boolean NOT NULL,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mfaAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mfaConfigs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`totpSecret` varchar(255),
	`backupCodes` text,
	`smsPhoneNumber` varchar(20),
	`verifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mfaConfigs_id` PRIMARY KEY(`id`),
	CONSTRAINT `mfaConfigs_adminId_unique` UNIQUE(`adminId`)
);
