import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

// This is a file automatically generated based on the db table using typeorm-model-generator
// Using this file as a base and extending it with the validator/transformer decorators allows for this to be regenerated without breaking legacy code

@Index("email_unique", ["email"], { unique: true })
@Index("users_pkey", ["pkUserId"], { unique: true })
@Index("username_unique", ["username"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
  @PrimaryGeneratedColumn({ type: "integer", name: "pk_user_id" })
  pkUserId: number;

  @Column("character varying", { name: "username", unique: true, length: 24 })
  username: string;

  @Column("character varying", { name: "email", unique: true, length: 128 })
  email: string;

  @Column("text", { name: "password", nullable: true })
  password: string | null;

  @Column("character varying", {
    name: "status",
    length: 16,
    default: () => "'user'",
  })
  status: string;

  @Column("character varying", {
    name: "role",
    length: 16,
    default: () => "'unverified'",
  })
  role: string;

  @Column("timestamp with time zone", { name: "last_login", nullable: true })
  lastLogin: Date | null;
}
