/*document.addEventListener("DOMContentLoaded", () => {
    const favButtons = document.querySelectorAll(".fav-btn");
    favButtons.forEach(button => {
        button.addEventListener("click", () => {
            button.innerText = "Added to Faves ❤️";
            button.style.background = "#4CAF50";
        });
    });


    
 });
 */

 let renters = JSON.parse(localStorage.getItem("renters")) || [
    {
        email: "john.doe@gmail.com",
        firstName: "John",
        lastName: "Doe",
        mobile: "+1 555-123-4567",
        dob: "15-05-1990",
        address: "123 Maple Street, New York, NY, USA"
    }
];

let owners = JSON.parse(localStorage.getItem("owners")) || [
    {
        email: "ethan.taylor@gmail.com",
        firstName: "Ethan",
        lastName: "Taylor",
        mobile: "+1 555-111-2233",
        dob: "10-01-1992",
        address: "111 Maple Avenue, San Francisco, CA, USA"
    }
];

 function SubmitFuncSignup(event) {
    event.preventDefault();
   
    const person = {
        email: $("input[name='email']").val(),
        firstName: $("input[name='firstname']").val(),
        lastName: $("input[name='lastname']").val(),
        mobile: $("input[name='mobilenumber']").val(),
        dob: $("input[name='DOB']").val(),
        address: $("input[name='Address']").val(),
    };

    const alreadyExists = renters.some(obj => {
        if (obj.email === person.email) {
            $(".Error").show();
            return true; 
        }
    });

    if (alreadyExists) return; 
    


    let selectedValue = $("#designation").val();

    if (selectedValue === "renter") {
        renters.push(person);
        localStorage.setItem("renters", JSON.stringify(renters));
    } else if (selectedValue === "owner") {
        owners.push(person);
        localStorage.setItem("owners", JSON.stringify(owners));
    }

    renters = JSON.parse(localStorage.getItem("renters"));
    owners = JSON.parse(localStorage.getItem("owners"));
    

    console.log("Updated Renters:", JSON.parse(localStorage.getItem("renters")));

    




    // ✅ Show alert so you can see the renters array before redirection
    // alert("Check console before redirection!");

    
                for (let i = 0; i < renters.length; i++) {
                    if (renters[i].email === person.email) {
                        window.location.href = "Home.html";
                        return;
                    }
                }
    
    
                for (let i = 0; i < owners.length; i++) {
                    if (owners[i].email === person.email) {
                        window.location.href = "owner.html";
                        return;
                    }
                }
                
                
                alert("User not found. Please sign up!");
                
                
                
}
function SubmitFuncLogin(_event) {

    let email = $("input[name='email']").val();
    
    for(let i = 0; i<renters.length; i++){
        if(email == renters[i].email){
            window.location.href = "Home.html";
            return;
        }
    }
    for(let i = 0; i<owners.length; i++){
        if(email == owners[i].email){
            window.location.href = "owner.html";
            return;
        }
    }
        
        
    $(".Error").show();


    
}
