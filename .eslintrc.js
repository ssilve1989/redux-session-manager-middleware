module.exports = {
    parser: "babel-eslint",
    "env": {
        "browser": true,
        "commonjs": true
    },
    plugins: ['flowtype'],
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};