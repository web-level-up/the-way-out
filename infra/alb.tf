resource "aws_lb" "app_lb" {
  name               = "way-out-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.way_out_public_subnet.id, aws_subnet.way_out_public_subnet2.id]

  enable_deletion_protection = false
}

resource "aws_lb_target_group" "frontend" {
  name        = "frontend-target-group"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.way_out_vpc.id
  target_type = "instance"
}

resource "aws_lb_target_group" "api" {
  name        = "api-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.way_out_vpc.id
  target_type = "instance"
}

resource "aws_lb_target_group_attachment" "frontend_attachment" {
  target_group_arn = aws_lb_target_group.frontend.arn
  target_id        = aws_instance.way_out_ec2.id
  port             = 3000
}

resource "aws_lb_target_group_attachment" "api_attachment" {
  target_group_arn = aws_lb_target_group.api.arn
  target_id        = aws_instance.way_out_ec2.id
  port             = 80
}

resource "aws_security_group" "alb_sg" {
  name        = "alb-sg"
  description = "Allow HTTPS in"
  vpc_id      = aws_vpc.way_out_vpc.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
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

// Add HTTP listener for port 80 
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = 80
  protocol          = "HTTP"
  depends_on        = [aws_lb_target_group.api]

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

// Add path-based routing for API requests
resource "aws_lb_listener_rule" "api_rule" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }

  depends_on = [aws_lb_target_group.api]
}
