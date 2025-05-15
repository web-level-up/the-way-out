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

variable "acm_certificate_arn" {
  description = "The ARN of the ACM certificate for the ALB"
  type        = string
}
