function PrefetchSignInLink() {

    const navigateToGoogleAuth = async () => {
        if(typeof window == 'undefined') return
        
        try {
            if(localStorage.getItem('googleSignInLink')) return
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/google/generateAuthUrl`)
            const { url } = await response.json()
            localStorage.setItem('googleSignInLink', url)
        } catch (error) {
            console.log(error)
        }
    }

    navigateToGoogleAuth()

    return null
}

export default PrefetchSignInLink