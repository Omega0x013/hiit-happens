DROP TABLE workout CASCADE ;
DROP TABLE exercise;

CREATE TABLE workout(
    id SERIAL8 PRIMARY KEY,
    google_id BIGINT NOT NULL,
    workout_name VARCHAR(255) NOT NULL
);

CREATE TABLE exercise(
    workout_id BIGINT NOT NULL,
    type VARCHAR(255),
    priority INT,
    duration INT,
    FOREIGN KEY (workout_id)
        REFERENCES workout(id)
);


