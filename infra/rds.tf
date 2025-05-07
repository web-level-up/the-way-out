resource "aws_db_instance" "way_out_db" {
  identifier             = "way-out-db"
  engine                 = "postgres"
  engine_version         = "17.4"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.way_out_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.way_out_db_sg.id]
  skip_final_snapshot    = true
  publicly_accessible    = true
  db_name                = "wayOutDb"

  tags = {
    Name        = "way_out_db"
    Environment = "prod"
  }
}

resource "aws_db_subnet_group" "way_out_db_subnet_group" {
  name       = "way_out_db_subnet_group"
  subnet_ids = [aws_subnet.way_out_public_subnet.id, aws_subnet.way_out_public_subnet2.id]

  tags = {
    Name        = "way_out_db_subnet_group"
    Environment = "prod"
  }
}

resource "aws_security_group" "way_out_db_sg" {
  name        = "way_out_db_sg"
  description = "Allow access to the way_out_db instance"
  vpc_id      = aws_vpc.way_out_vpc.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
