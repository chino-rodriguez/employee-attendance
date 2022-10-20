-- DROP TABLE Employee;

-- CREATE TABLE IF NOT EXISTS Employee (
--     id UUID UNIQUE,
--     firstname varchar(30) NOT NULL,
--     lastname varchar(30) NOT NULL,
--     username varchar(20) PRIMARY KEY NOT NULL UNIQUE,
--     password varchar(60) NOT NULL
-- );

-- SELECT * FROM Employee;

-- DROP TABLE Wage;

-- CREATE TABLE IF NOT EXISTS Wage (
--     id uuid UNIQUE,
--     position varchar(30) PRIMARY KEY NOT NULL UNIQUE,
--     wage decimal
--     );
    
--SELECT * FROM Wage;

-- DROP TABLE Entry;
-- DROP TABLE Shift;

-- CREATE TABLE IF NOT EXISTS Shift (
--     id UUID UNIQUE,
--     employeeid UUID NOT NULL,
--         CONSTRAINT fk_employeeid
--         FOREIGN KEY (employeeid)
--         REFERENCES Employee(id),
--     date date NOT NULL,
--     timein timestamptz NOT NULL,
--     timeout timestamptz NOT NULL,
--     hours decimal,
--     position varchar(30) NOT NULL,
--         CONSTRAINT fk_position
--         FOREIGN KEY (position)
--         REFERENCES Wage(position),
--     salary decimal 
-- );

-- SELECT * FROM Shift;