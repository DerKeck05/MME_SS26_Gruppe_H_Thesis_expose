import bcrypt from "bcrypt";

// Amount of Hashing Rounds
const SALT_ROUNDS = 10;

// hashes the password and returns the hash
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

// verifys the entered password with the saved hash
export async function verifyPassword(
    password: string,
    passwordHash: string
): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
}