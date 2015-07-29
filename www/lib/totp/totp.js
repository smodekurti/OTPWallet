
 
    function dec2hex(s) {
        return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
    }
 
   function hex2dec(s) {
        return parseInt(s, 16);
    }
 
    function leftpad(s, l, p) {
        if(l + 1 >= s.length) {
            s = Array(l + 1 - s.length).join(p) + s;
        }
        return s;
    }
 
   function base32tohex(base32) {
        var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var bits = "";
        var hex = "";
        for(var i = 0; i < base32.length; i++) {
            var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += leftpad(val.toString(2), 5, '0');
        }
        for(var i = 0; i + 4 <= bits.length; i+=4) {
            var chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16) ;
        }
        return hex;
    }
 
    function getOTP(secret) {
        try {
            var epoch = Math.round(new Date().getTime() / 1000.0);
            var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0");
            var hmacObj = new jsSHA(time, "HEX");
            var hmac = hmacObj.getHMAC(base32tohex(secret), "HEX", "SHA-1", "HEX");
            var offset = hex2dec(hmac.substring(hmac.length - 1));
            var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
            otp = (otp).substr(otp.length - 6, 6);
        } catch (error) {
            throw error;
        }
        
        return otp;
    }


    var Base32Decode = function (base32EncodedString) {
        /// <summary>Decodes a base32 encoded string into a Uin8Array, note padding is not supported</summary>
        /// <param name="base32EncodedString" type="String">The base32 encoded string to be decoded
        /// <returns type="Uint8Array">The Unit8Array representation of the data that was encoded in base32EncodedString</returns>
        if (!base32EncodedString && base32EncodedString !== "") {
            throw "base32EncodedString cannot be null or undefined";
        }

        if (base32EncodedString.length * 5 % 8 !== 0) {
            throw "base32EncodedString is not of the proper length. Please verify padding.";
        }

        base32EncodedString = base32EncodedString.toLowerCase();
        var alphabet = "abcdefghijklmnopqrstuvwxyz234567";
        var returnArray = new Array(base32EncodedString.length * 5 / 8);

        var currentByte = 0;
        var bitsRemaining = 8;
        var mask = 0;
        var arrayIndex = 0;

        for (var count = 0; count < base32EncodedString.length; count++) {
            var currentIndexValue = alphabet.indexOf(base32EncodedString[count]);
            if (-1 === currentIndexValue) {
                if ("=" === base32EncodedString[count]) {
                    var paddingCount = 0;
                    for (count = count; count < base32EncodedString.length; count++) {
                        if ("=" !== base32EncodedString[count]) {
                            throw "Invalid '=' in encoded string";
                        } else {
                            paddingCount++;
                        }
                    }

                    switch (paddingCount) {
                        case 6:
                            returnArray = returnArray.slice(0, returnArray.length - 4);
                            break;
                        case 4:
                            returnArray = returnArray.slice(0, returnArray.length - 3);
                            break;
                        case 3:
                            returnArray = returnArray.slice(0, returnArray.length - 2);
                            break;
                        case 1:
                            returnArray = returnArray.slice(0, returnArray.length - 1);
                            break;
                        default:
                            throw "Incorrect padding";
                    }
                } else {
                    throw "base32EncodedString contains invalid characters or invalid padding.";
                }
            } else {
                if (bitsRemaining > 5) {
                    mask = currentIndexValue << (bitsRemaining - 5);
                    currentByte = currentByte | mask;
                    bitsRemaining -= 5;
                } else {
                    mask = currentIndexValue >> (5 - bitsRemaining);
                    currentByte = currentByte | mask;
                    returnArray[arrayIndex++] = currentByte;
                    currentByte = currentIndexValue << (3 + bitsRemaining);
                    bitsRemaining += 3;
                }
            }
        }

        return new Uint8Array(returnArray);
    };


    function getTotp(secret){
        var otp = getOTP(secret);
       return otp;
    }