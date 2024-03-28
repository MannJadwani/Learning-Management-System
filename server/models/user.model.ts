import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const emailRegexPattern: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        publicId: string;
        url: string;
    }
    role: string;
    isVerified: boolean;
    courses: Array<{ courseId: string }>;
    comparePasswords: (password: string) => Promise<boolean>;
}


const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        validate: {
            validator: function (value: string) {
                return emailRegexPattern.test(value);
            },
            message: 'please enter a valid email'
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, "Password must be atleast 6 characters"],
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            courseId: String,
        }
    ]
}, { timestamps: true });


// Hash Password

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.comparePasswords = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);

}

const userModal: Model<IUser> = mongoose.model('User', userSchema);

export default userModal;
