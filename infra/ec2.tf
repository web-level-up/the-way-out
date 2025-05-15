resource "aws_instance" "way_out_ec2" {
  ami                    = "ami-0b7e05c6022fc830b"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.way_out_public_subnet.id
  vpc_security_group_ids = [aws_security_group.way_out_ec2_sg.id]
  key_name               = aws_key_pair.ssh_key_pair.key_name

  tags = {
    Name        = "way_out_ec2"
    Environment = "prod"
  }
}

resource "aws_security_group" "way_out_ec2_sg" {
  name        = "way_out_ec2_sg"
  description = "Allow access to the way_out_ec2 instance"
  vpc_id      = aws_vpc.way_out_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
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

resource "tls_private_key" "ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "ssh_key_pair" {
  key_name   = "way-out-ssh-key"
  public_key = tls_private_key.ssh_key.public_key_openssh
}
