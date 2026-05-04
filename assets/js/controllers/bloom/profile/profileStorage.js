export function saveUserToLocalStorage(user) {
    try {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u) => u.id === user.id);

        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...user };
        } else {
            users.push(user);
        }

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    } catch (error) {
        console.error('Error saving user to localStorage:', error);
        return false;
    }
}

export function saveCVToLocalStorage(userId, cvProfile) {
    try {
        let cvProfiles = JSON.parse(localStorage.getItem('cvProfiles') || '{}');
        cvProfiles[userId] = cvProfile;
        localStorage.setItem('cvProfiles', JSON.stringify(cvProfiles));
        return true;
    } catch (error) {
        console.error('Error saving CV to localStorage:', error);
        return false;
    }
}
