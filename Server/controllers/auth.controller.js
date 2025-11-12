import { editPassword, editUserSchema, loginUserSchema, registerUserSchema } from "../validators/auth_validator.js";
import { getUserByEmail, 
        hashPassword, 
        createUser, 
        comparePassword, 
        authenticateUser, 
        createContactMessage, 
        addHistory, 
        getHistory, 
        deleteHistoryById, 
        checkIfAdmin, 
        getAllUsers, 
        getAllMeetingRooms, 
        getAllMessages, 
        deleteUserById, 
        deleteMeetingRoomById, 
        deleteMessageById,
        editUser,
        editUserPassword,
    } from "../services/auth.service.js";
import { ContactSchema } from "../validators/contactMessage_Validator.js";





export const postRegister = async(req, res) => {
    if(req.user) return res.redirect("/");

    console.log(req.body);

    const {data, error} = registerUserSchema.safeParse(req.body);

    console.log(data);

    if(error){
        const extraDetails = error.issues.map((curElem) => curElem.message);
        return res.status(400).json({error: extraDetails})
    }


    const {name, email, password} = data;


    const userExist = await getUserByEmail(email);

    if(userExist){
        return res.status(409).json({error: "User already exist!"})
    }

    const hashedPassword = await hashPassword(password);

    const [user] = await createUser({name, email, password:hashedPassword});

    const {accessToken, refreshToken} = await authenticateUser({req, res, id: user.id,  name, email})

    res.status(200).json({
        message : "Register Successfull",
    })
}


export const postLogin = async(req, res) => {
    if(req.user) return res.redirect("/");

    const {data, error} = loginUserSchema.safeParse(req.body);

    if(error){
        const extraDetails = error.issues.map((curElem) => curElem.message);
        return res.status(400).json({error: extraDetails})
    }

    const {email, password} = data;

    const userExist = await getUserByEmail(email);

    if(!userExist){
        return res.status(400).json({error: "Invalid email or password"})
    }

    const isPasswordValid = await comparePassword(password,userExist.password);

    if(!isPasswordValid){
        return res.status(422).json({error: "Invalid email or password"})
    }


    const {accessToken, refreshToken} = await authenticateUser({req, 
                                                                res, 
                                                                id: userExist.id, 
                                                                name: userExist.name, 
                                                                email: userExist.email})

    res.status(200).json({
        message : "Login Successfull",
    })  
}


export const postContactMessage = async(req, res) => {
    if(req.user) res.redirect("/");

    const {name, email, message} = req.body;

    const {data, error} = ContactSchema.safeParse({message});

    if(error){
        const extraDetails = error.issues.map((curElem) => curElem.message);
        return res.status(400).json({error: extraDetails})
    }

    const userExist = await getUserByEmail(email);

    if(!userExist){
        return res.status(422).json({error: "Invalid email or password"})
    }

    const [contactMessage] = await createContactMessage({userId: userExist.id, message})

    res.status(200).json({
        message : "Message Successfull Sent",
    })
}

export const User = async(req, res) => {
    if(!req.user) res.redirect("/");
    try{
        const User=req.user;

        return res.status(200).json({
            user:{
                name: User.name,
                email: User.email,
            }
        });
    }catch(error){
        return res.status(500).json({error: "Something went wrong"});
    }
}


export const AddHistory = async(req, res) => {
    if(!req.user) res.redirect("/");

    const { meetingCode } = req.body;

    const {userId} = req.user;

    try{
        await addHistory(userId, meetingCode);
        res.status(200).json({ message: "Added code to history" })
    }catch(e) {
        res.status(400).json({ message: `Something went wrong ${e}` })
    }
}

export const GetHistory = async(req, res) => {
    if(!req.user) res.redirect("/");


    const {userId} = req.user;
     
    try{
        const history=await getHistory(userId);
        res.status(200).json({data: history} );
    }catch(e) {
        res.status(400).json({ message: `Something went wrong ${e}` })
    }
}

export const RemoveHistory = async(req, res) => {
    if(!req.user) res.redirect("/");

    const {id} = req.params;

    if (!id) {
        return res.status(400).json({ message: "Missing history ID in URL" });
    }

    try{
        await deleteHistoryById(id);
        res.status(200).json({ message: "Delete Successful" });
    }catch(e) {
        res.status(400).json({ message: `Something went wrong ${e}` })
    }
}


export const CheckIsAdmin = async(req, res) => {
   if(!req.user) res.redirect("/");

   const {userId} = req.user;

   try{
        const isAdmin = await checkIfAdmin(userId);
        
        res.status(200).json({ isAdmin: isAdmin });
    }catch(e) {
        res.status(400).json({ message: `Something went wrong ${e}` })
    }
}

export const GetAllUsers = async(req, res) => {
    if(!req.user) res.redirect("/");

    try{
        const users = await getAllUsers();
        res.status(200).json(users);
    }catch(e) {
        res.status(400).json({ message: `Something went wrong ${e}` })
    }
}

export const GetAllMeetingRooms = async(req, res) => {
    if(!req.user) res.redirect("/");

    try{
        const meetingRooms = await getAllMeetingRooms();
        res.status(200).json(meetingRooms);
    }catch(e) {
        res.status(400).json({ message: `Something went wrong ${e}` })
    }
}

export const GetAllMessages = async(req, res) => {
    if(!req.user) res.redirect("/");

    try{
        const meetingRooms = await getAllMessages();
        res.status(200).json(meetingRooms);
    }catch(e) {
        res.status(400).json({ message: `Something went wrong ${e}` })
    }
}

export const RemoveUser = async(req, res) =>{
    if(!req.user) res.redirect("/");

    const {id} = req.params;

    if (!id) {
        return res.status(400).json({ message: "Missing history ID in URL" });
    }

    try{
        await deleteUserById(id);
        res.status(200).json({ message: "Delete Successful" });
    }catch(e) {
        res.status(400).json({ message: `Something went wrong ${e}` })
    }
}

export const RemoveMeetingRoom = async(req, res) =>{
    if(!req.user) res.redirect("/");

    const {id} = req.params;

    if (!id) {
        return res.status(400).json({ message: "Missing history ID in URL" });
    }

    try{
        await deleteMeetingRoomById(id);
        res.status(200).json({ message: "Delete Successful" });
    }catch(e) {
        res.status(400).json({ message: `Something went wrong ${e}` })
    }
}

export const RemoveMessage = async(req, res) =>{
    if(!req.user) res.redirect("/");

    const {id} = req.params;

    if (!id) {
        return res.status(400).json({ message: "Missing history ID in URL" });
    }

    try{
        await deleteMessageById(id);
        res.status(200).json({ message: "Delete Successful" });
    }catch(e) {
        res.status(400).json({ message: `Something went wrong ${e}` })
    }
}

export const AddUser = async(req, res) => {
    if(!req.user) res.redirect("/");


    const {data, error} = registerUserSchema.safeParse(req.body);


    if(error){
        const extraDetails = error.issues.map((curElem) => curElem.message);
        return res.status(400).json({error: extraDetails})
    }

    const {name, email, password} = data;


    const userExist = await getUserByEmail(email);

    if(userExist){
        return res.status(409).json({error: "User already exist!"})
    }

    const hashedPassword = await hashPassword(password);

    const [user] = await createUser({name, email, password:hashedPassword});

    return res.status(200).json({message: "SuccessFfully add user"});
}

export const EditUser = async(req, res) => {
    if(!req.user) res.redirect("/");

    const {prevName, prevEmail, newName, newEmail} = req.body;

    const oldUser = {name: prevName, email: prevEmail}
    const newUser = {name: newName, email: newEmail}


    const {data, error} = editUserSchema.safeParse(newUser);

    if(error){
        const extraDetails = error.issues.map((curElem) => curElem.message);
        return res.status(400).json({error: extraDetails})
    }

    await editUser(oldUser, newUser);

    return res.status(200).json({message: "SuccessFfully edit user"});
}

export const EditPassword = async(req, res) => {
    if(!req.user) res.redirect("/");

    const {user, password} = req.body;

    const {data, error} = editPassword.safeParse(password);

    if(error){
        const extraDetails = error.issues.map((curElem) => curElem.message);
        return res.status(400).json({error: extraDetails})
    }

    const newHashPassword = await hashPassword(password.newPassword);

    const userExist = await getUserByEmail(user.email);

    if(!userExist){
        return res.status(400).json({error: "user does not exit"})
    }

    const isPasswordValid = await comparePassword(password.previousPassword,userExist.password);

    if(!isPasswordValid){
        return res.status(422).json({error: "Invalid password"})
    }

    await editUserPassword({email: user.email, password: newHashPassword});

    return res.status(200).json({message: "SuccessFfully edit password"});
}