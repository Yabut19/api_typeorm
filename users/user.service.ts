import bcrypt from 'bcryptjs';
import { getRepository } from 'typeorm';
import { User} from '../users/user.model';

export const userService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll(): Promise<User[]> {
    const userRepository = getRepository(User);
    return await userRepository.find();
}

async function getById(id: number): Promise<User> {
    return await getUser(id);
}

async function create(params: Partial<User>): Promise<void> {
    const userRepository = getRepository(User);

    // Validate
    if (await userRepository.findOne({ where: { email: params.email } })) {
        throw new Error(`Email "${params.email}" is already registered`);
    }

    // Hash password
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // Save user
    const user = userRepository.create(params);
    await userRepository.save(user);
}

async function update(id: number, params: Partial<User>): Promise<void> {
    const userRepository = getRepository(User);
    const user = await getUser(id);

    // Validate username change
    if (params.username && params.username !== user.email) {
        const usernameTaken = await userRepository.findOne({ where: { email: params.username } });
        if (usernameTaken) {
            throw new Error(`Username "${params.username}" is already taken`);
        }
    }

    // Hash password if it was entered
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // Copy params to user and save
    Object.assign(user, params);
    await userRepository.save(user);
}

async function _delete(id: number): Promise<void> {
    const userRepository = getRepository(User);
    const user = await getUser(id);
    await userRepository.remove(user);
}

// Helper function
async function getUser(id: number): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    return user;
}
