import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React from 'react'
import { Avatar } from "@react-native-material/core";


const Feedscreen = () => {

    return (
        <ScrollView>
            <View style={styles.post}>
                <View style={styles.container}>
                    <View style={styles.user}>
                        <Avatar label="First Last" autoColor size={30} />
                        <Text style={styles.username}>First Last</Text>
                        <Text style={{ fontSize: 12 }}>1 min ago</Text>
                    </View>
                    <View style={{ margin: '20px 0' }}>
                        <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam culpa temporibus sit quis delectus, commodi saepe veritatis neque nemo voluptatem placeat illo nostrum aliquid, necessitatibus modi eveniet adipisci laboriosam blanditiis nisi amet ad praesentium quod? Ex neque recusandae cupiditate impedit sit, nulla temporibus sed saepe sint blanditiis provident vel culpa.</Text>
                        <Image
                            style={styles.Img}
                            source={{ uri: 'https://images.pexels.com/photos/1788912/pexels-photo-1788912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.post}>
                <View style={styles.container}>
                    <View style={styles.user}>
                        <Avatar label="First Last" autoColor size={30} />
                        <Text style={styles.username}>First Last</Text>
                        <Text style={{ fontSize: 12 }}>1 min ago</Text>
                    </View>
                    <View style={{ margin: '20px 0' }}>
                        <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus voluptatem saepe natus ullam, voluptatum non possimus iste eaque similique quia.</Text>
                        <Image
                            style={styles.Img}
                            source={{ uri: 'https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.post}>
                <View style={styles.container}>
                    <View style={styles.user}>
                        <Avatar label="First Last" autoColor size={30} />
                        <Text style={styles.username}>First Last</Text>
                        <Text style={{ fontSize: 12 }}>1 min ago</Text>
                    </View>
                    <View style={{ margin: '20px 0' }}>
                        <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut corporis laudantium quod quaerat expedita cum illo velit voluptatem sunt nostrum beatae, dolorem fuga harum assumenda, maiores tenetur odit tempora distinctio, dolores voluptate sint dolorum aut doloremque placeat. Cupiditate tempora ut voluptas! Aperiam quia reiciendis impedit dolore maxime sit minima illum aspernatur atque fugiat est, necessitatibus, laborum nihil et quo. Repellat harum repudiandae, laborum nesciunt maxime recusandae odio minima voluptatibus facere.</Text>
                        <Image
                            style={styles.Img}
                            source={{ uri: 'https://images.pexels.com/photos/1118332/pexels-photo-1118332.jpeg?auto=compress&cs=tinysrgb&w=600' }}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Feedscreen

const styles = StyleSheet.create({
    post:
    {
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        width: '40%',
        borderRadius: 10,
        marginBottom: '5px',
        marginTop: '5px'
    },
    container:
    {
        padding: '10px'
    },
    user: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    username: {
        fontSize: 15,
        fontWeight: '500',
        margin: '0 10px'
    },
    Img:
    {
        marginTop: '20px',
        width: '100%',
        height: '500px',
        resizeMode: 'cover'
    },
})