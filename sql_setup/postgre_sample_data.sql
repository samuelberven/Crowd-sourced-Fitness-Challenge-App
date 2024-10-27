-- Insert starter user data
INSERT INTO users (name)
VALUES
('Sam'),
('Paola'),
('Liz');

-- Insert starter badges data

-- Insert difficulty data. This table is not modifiable.
INSERT INTO difficulty (name)
VALUES
('Easy'),
('Medium'),
('Hard');

-- Insert starter challenges data
INSERT INTO challenges (name, description, difficulty)
VALUES
('Run a mile', 'Go from zero to able to run a mile', 'Easy'),
('Run a 5k', 'Go from a mile to a 5k', 'Easy'),
('Run a half-marathon', 'Go from a 5k to a half-marathon', 'Medium'),
('Run a marathon', 'Go from a half-marathon to a full marathon', 'Hard')

-- Insert starter goals data
INSERT INTO goals (name, description)
VALUES
    ('5 times', 'Participate 5 times'),
    ('10 times', 'Participate 10 times'),
    ('15 times', 'Participate 15 times')

-- Insert starter tags data
INSERT INTO tags (name)
VALUES
('superstar'),
('dedication'),
('fitness');

-- Insert starter challenge_goals data
INSERT INTO challenge_goals (challenge_id, goal_id) 
VALUES
(1, 3),
(2, 1),
(3, 2)
;

-- Insert starter challenge_tags data

-- Insert starter users_badges data
