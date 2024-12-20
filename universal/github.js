import { Linking } from "react-native"

const link = 'https://github.com/baole444/LaPetiteAMusixBox/releases/latest'

function openReleasePage() {
    Linking.openURL(link);
}

export default {
    openReleasePage,
}