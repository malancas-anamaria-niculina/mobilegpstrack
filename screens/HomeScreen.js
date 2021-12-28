import React, { useState } from 'react';
import { TouchableOpacity, Button, View, StyleSheet, Text, TextInput } from 'react-native';

import axios from "axios";
import { API_URL } from "@env";

const HomeScreen = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = () => {
        const url = `${API_URL}/login`
        axios.post(url, {
            username: username,
            password: password,
        })
            .then((response) => {
                navigation.navigate('Location', {
                    token: response.data,
                    username: username
                });
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 401) {
                    setModal({
                        isOpen: true,
                        message: "Invalid credentials!"
                    })
                } else {
                    setModal({
                        isOpen: true,
                        message: "Something went wrong!"
                    })
                }
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logInTextStyle}>
                Log in
            </Text>
            <View style={styles.credentialsStyle}>
                <Text style={styles.emailTextStyle}>
                    Username
                </Text>
                <TextInput style={styles.emailInput}
                    placeholder="Enter email"
                    placeholderTextColor={'gray'}
                    value={username}
                    onChangeText={text => setUsername(text)}></TextInput>
            </View>
            <View style={styles.credentialsStyle}>
                <Text style={styles.emailTextStyle}>
                    Password
                </Text>
                <TextInput style={styles.emailInput}
                    placeholder="Enter password"
                    placeholderTextColor={'gray'}
                    value={password}
                    onChangeText={text => setPassword(text)}></TextInput>
            </View>
            <Button
                title="Login"
                onPress={() => {
                    login();
                }
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        padding: 10,
        flexDirection: "column",
    },
    credentialsStyle: {
        width: "100%",
        padding: 30,
        paddingBottom: 20,
        paddingVertical: 5,
        alignSelf: "flex-start",
    },
    logInTextStyle: {
        fontSize: 30,
        color: '#161853',
        marginVertical: 16,
        padding: 30,
        alignSelf: "flex-start",
    },
    emailTextStyle: {
        fontSize: 20,
        color: 'black',
        padding: 5,
        alignSelf: "flex-start",
    },
    emailInput: {
        borderWidth: 0.5,
        borderColor: "#161853",
        borderRadius: 20,
        width: "100%",
        color: 'black'
    },
    loginButton: {
        backgroundColor: '#161853',
        padding: 10,
        paddingTop: 10,
        borderRadius: 20,

    },
    loginText: {
        textAlign: 'center',
        color: 'white',
    },
    loginView: {
        width: "100%",
        height: "100%",
        paddingTop: 50,
        alignSelf: "center",
    }
});

export default HomeScreen;