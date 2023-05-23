import React, { useState } from "react";
import { Platform, ScrollView, FlatList, ImageBackground, TouchableHighlight } from "react-native";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import ImagePicker from "../components/ImagePicker";

export const RequestFormScreen = ({ navigation }) => {

    return (
        <ScrollView>
            <ImagePicker />
        </ScrollView>
    )
}

const styles = StyleSheet.create({

})