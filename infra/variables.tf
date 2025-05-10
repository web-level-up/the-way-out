variable "db_username" {
  description = "The username for the database instance"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "The password for the database instance"
  type        = string
  sensitive   = true
}

variable "ec2_key_name" {
  description = "The name of the key pair to use for the EC2 instance"
  type        = string
}
