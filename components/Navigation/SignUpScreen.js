import React, {Component, useEffect, useState} from "react";
import {Text, View, StyleSheet, Modal, Dimensions, TouchableOpacity, StatusBar, Image, useWindowDimensions, TextBase} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TextInput } from "react-native-gesture-handler";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { Overlay } from "@rneui/base";

import FormSuccess from "../shared/formSuccess";
import Loader from '../shared/loader'
import Colors from '../const/color';
import { authentication } from '../../firebase/firebase-config';

// TextField not empty validation function
const isValidObjField = (obj) =>{
    return Object.values(obj).every(value=> value.trim())
}

const SignUpScreen = ({navigation,onPress}) => {
    const [userInfo, setUserInfo] = useState({
        username: '',
        phone_num: '',
        email: '',
        password: '',
        confirm_password: '',
    })
    const{username, phone_num, email, password, confirm_password} = userInfo
    const [loader, setLoader] = useState(false);
    const [OverlayText, setOverlayText] = useState("");
    const [popUpErr, setpopUpErr] = useState(false);

    // Listens to auth changes 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authentication, (user) => {
            if (user) {
                navigation.navigate('ProfileLogedIn');
            }
        });
        return unsubscribe
    }, [])

    // OnChangeText function for textfields 
    const handleOnChangeText = (value,fieldName)=> {
        setUserInfo({...userInfo,[fieldName]:value})
    };

    // Function to validate user input
    const formValidation = () =>{
        setLoader(true);
        if(!isValidObjField(userInfo)) {
            setOverlayText("Please fill all fields");
            return setpopUpErr(true);
        }
        if(username.length < 5 ) {
            setOverlayText("Minimum 5 characters required for username");
            return setpopUpErr(true);
        }
        if(phone_num.length < 10 || phone_num.length > 12) {
            setOverlayText("Invalid phone number");
            return setpopUpErr(true);
        }
        if(!email.includes('@')) {
            setOverlayText("Invalid email");
            return setpopUpErr(true);
        }
        if(password.length < 7 ) {
            setOverlayText("Minimum 8 characters required for password");
            return setpopUpErr(true);
        }
        if(password !== confirm_password) {
            setOverlayText("Passwords do not match");
            return setpopUpErr(true);
        }
        return true;
    };

    // Function to create new user
    const registerUser = ()=>{
        if(formValidation()){
            createUserWithEmailAndPassword(authentication, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log("Registered with: ", user.email);
                setLoader(false);
            })
            .catch((e) => {
                setLoader(false);
                setOverlayText(e.message);
                setpopUpErr(true);
            })
        }
        else
            setLoader(false);
    };

    return(
        <>
            <View style={styles.container}>
                <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />


                <View style={styles.backNav}>
                    <Ionicons
                        name="chevron-back-sharp"
                        size={40}
                        color='black'
                        onPress={navigation.goBack}
                    />
                </View>
                <View>
                    <Text style={{ 
                        alignSelf: 'center',
                        fontSize:28, 
                        marginTop: 20, 
                        color: 'black', 
                        fontWeight: 'bold'}}>Let's Get You Registered !
                    </Text>
                </View>

                {/* Username TextField */}
                <View style={styles.inputContainer} >
                    <TextInput  placeholder="Username"  
                    value={username}
                    onChangeText = {(value) => handleOnChangeText(value,'username')}
                    style={styles.input} />
                </View>

                {/* Phone Number TextField */}
                <View style={styles.inputContainer} >
                    <TextInput  placeholder="Phone Number"
                    value={phone_num}  
                    onChangeText = {(value) => handleOnChangeText(value,'phone_num')}
                    keyboardType={'phone-pad'} 
                    style={styles.input} />
                </View>

                {/* Email TextField */}
                <View style={styles.inputContainer} >
                    <TextInput  placeholder="Email Address" 
                    value={email}
                    onChangeText = {(value) => handleOnChangeText(value,'email')}
                    keyboardType={'email-address'} 
                    autoCapitalize = 'none'
                    style={styles.input} />
                </View>

                {/* Password TextField */}
                <View style={styles.inputContainer} >
                    <TextInput  
                        placeholder="Password" 
                        value={password}
                        onChangeText = {(value) => handleOnChangeText(value,'password')}
                        autoCapitalize = 'none'
                        secureTextEntry={true}
                        style={styles.input} />
                </View>

                {/* Confirm Password TextField */}
                <View style={styles.inputContainer} >
                    <TextInput  
                        placeholder="Confirm Password" 
                        value = {confirm_password}
                        onChangeText = {(value) => handleOnChangeText(value,'confirm_password')}
                        autoCapitalize = 'none'
                        secureTextEntry={true}
                        style={styles.input} />
                </View>

                <View style={{flexDirection: 'row', paddingTop: 20, paddingLeft: 10}}>
                        <Text style={{fontSize:12, color: Colors.lightblack, paddingLeft: 28}}> By registering, you confirm that you accept our </Text>
                        <Text style={{fontSize:12, color: Colors.primary}}>Terms of Use </Text>
                </View>
                <View style={{flexDirection: 'row',paddingLeft: 10}}>
                        <Text style={{fontSize:12, color: Colors.lightblack , paddingLeft: 31}}>and</Text>
                        <Text style={{fontSize:12, color: Colors.primary}}> Privacy Policy. </Text>
                        
                </View>

                <View style={styles.signUpButton}>
                    <TouchableOpacity onPress={registerUser}>
                        <View style={styles.buttonContainer}>
                            <Text style={{color: Colors.white, fontSize: 20, fontWeight: 'bold'}}>Sign Up</Text>
                        </View>
                    </TouchableOpacity>    
                </View>

                <View style={{flexDirection:'row', alignSelf: 'center'}} >
                    <Text style={{fontSize:13, marginTop: 12, color: Colors.grey}}> Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
                        <Text style={{fontSize:13, marginTop: 12, paddingLeft: 4, color: 'black', fontWeight: 'bold', textDecorationLine: 'underline'}}>Log In</Text>
                    </TouchableOpacity>
                </View>

                { loader ? <Loader/> : null }

                <Overlay isVisible={popUpErr} overlayStyle={{backgroundColor: "white", borderColor: "white", borderRadius: 20}} onBackdropPress={() => setpopUpErr(false)}>
                    <FormSuccess errorBtn={() => setpopUpErr(false)} text={OverlayText} error={popUpErr} />
                </Overlay>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container:{
        backgroundColor: Colors.white, 
        flex: 1,
    },
    backNav:{
        marginTop: 20,
        marginHorizontal: 15,
        marginBottom: 5,
    },
    inputContainer:{
        marginTop: 15,
        alignSelf: 'center',
        paddingLeft: 20,
        height: 50,
        width: 330,
        elevation: 25,
        borderRadius: 30,
        backgroundColor: Colors.white,
        borderWidth: 0,
    },
    signUpButton:{
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: Colors.primary,
        marginHorizontal: 20,
        borderRadius: 15, 
    },
})


export default SignUpScreen;