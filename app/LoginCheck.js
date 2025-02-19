const elementosLogOut = document.querySelectorAll('.log-out')
const elementosLogIn = document.querySelectorAll('.log-in')

//console.log(elementosLogOut)
//console.log(elementosLogIn)

export const loginCheck = user => {

    if (user){

        elementosLogIn.forEach(element => element.style.display = 'block')
        elementosLogOut.forEach(element => element.style.display = 'none')

    } else {

        elementosLogIn.forEach(element => element.style.display = 'none')
        elementosLogOut.forEach(element => element.style.display = 'block')

    }

}