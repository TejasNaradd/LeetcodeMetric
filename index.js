document.addEventListener("DOMContentLoaded",function(){
     
    const searchButton = document.getElementById("sea-butt")
    const userInput = document.getElementById("user-input")
    const statsContainer = document.querySelector(".stats-container")
    const easyProgressCircle= document.querySelector(".easy-prog")
    const mediumProgressCircle= document.querySelector(".med-prog")
    const hardProgressCircle= document.querySelector(".hard-prog")
    const easyLabel = document.getElementById("easy-level")
    const medLabel = document.getElementById("med-level")
    const hardLabel = document.getElementById("hard-level")
    const cardStatsContainer = document.querySelector(".stats-cards")

    //return true or false based on a regex
    function validateUsername(username) {
        if(username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

        function updateProgress(solved,total,label,circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }
    function displayUserData(parsedData){
        statsContainer.style.display = "block";
        
        const totalQuestions = parsedData.totalQuestions;
        const totalEasy = parsedData.totalEasy;
        const totalMedium = parsedData.totalMedium;
        const totalHard = parsedData.totalHard;
        console.log("display data",totalEasy);
        const totalSolved = parsedData.totalSolved;
        const easySolved = parsedData.easySolved;
        const mediumSolved = parsedData.mediumSolved;
        const hardSolved = parsedData.hardSolved;
        
        updateProgress(easySolved,totalEasy,easyLabel,easyProgressCircle);
        updateProgress(mediumSolved,totalMedium,medLabel,mediumProgressCircle);
        updateProgress(hardSolved,totalHard,hardLabel,hardProgressCircle);

            const cardsData = [
            {label: "Overall acceptanceRate", value:parsedData.acceptanceRate},
            {label: "Overall ranking", value:parsedData.ranking},
            {label: "Overall contributionPoints", value:parsedData.contributionPoints},
            {label: "Overall totalSolved", value:parsedData.totalSolved},
            ];

        cardStatsContainer.innerHTML = cardsData.map(
            data => 
                    `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
        ).join("")

    }

    //fetching user details

    async function fetchUserDetails(username) {
        
        try{
            const url = `https://leetcode-stats-api.herokuapp.com/${username}`
            searchButton.textContent = "Searching...";
            searchButton.disabled=true;
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch user Details");
            }
            const parsedData = await  response.json();

            if (parsedData.status !== "success") {
                 throw new Error(parsedData.message);
            }
            console.log("logging Data : " ,parsedData);

            displayUserData(parsedData);

        }
        catch(error){
            statsContainer.style.display = "block";
            statsContainer.textContent = `<p>${error.message}</p>`;

        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }

    searchButton.addEventListener('click',function(){
        const username = userInput.value;
        console.log("logging username : ",username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
})
