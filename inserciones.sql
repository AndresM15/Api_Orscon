insert into states (id_state, description) values
(1, 'Activo'),
(2, 'Inactivo'),
(3, 'Suspendido');

insert into users (fullname, user, email, password, state_id)
values
('John Doe', 'johndoe', 'johndoe@example.com', 'password123', 1),
('Jane Smith', 'janesmith', 'janesmith@example.com', 'password456', 1),
('Michael Johnson', 'michaeljohnson', 'michaeljohnson@example.com', 'password789', 1),
('Emily Davis', 'emilydavis', 'emilydavis@example.com', 'password111', 1),
('David Lee', 'davidlee', 'davidlee@example.com', 'password222', 1);

