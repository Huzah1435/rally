//Dependencies
import React , { Component } from "react";
import axios from 'axios';

//! Is this the correct way????????
//Check if production or local
//Users Routes
let API_URL = '';
//Centers Routes
let API_URL_CENTERS = '';
if (process.env.NODE_ENV === 'production') {
    API_URL = 'https://racquet-rally.herokuapp.com/user';
    API_URL_CENTERS = 'https://racquet-rally.herokuapp.com/center';
}else{
    API_URL = 'http://localhost:4000/user';
    API_URL_CENTERS = 'http://localhost:4000/center';
}

//CSS Styles
const styleBtn = {
    marginRight: '5px' 
};

//Class Component
export default class CreateUser extends Component {

    //Set state and bindings
    constructor(props){
        //Need super if a sub class, this is not in app.js
        super(props);

        //Need to bind this to the class
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeSkillLevel = this.onChangeSkillLevel.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeCenter = this.onChangeCenter.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            name: '',
            skillLevel:0,
            image:'',
            email:'',
            centers:[],
            newCenters:[],
        }
    }

    //Get all the centers when the component mounts
    componentDidMount(){
        axios.get(`${API_URL_CENTERS}`)
        
        .then(response => {
            console.log(response.data);
            
            this.setState({
                centers: response.data
            })
        })
        .catch(err =>{
            console.log(err);        
        })
    }
    
    //Set state when the name changes
    onChangeName(e){
        this.setState({
            name: e.target.value
        });
    }

    //Set state when the skill level changes
    onChangeSkillLevel(e){
        this.setState({
            skillLevel: e.target.value
        });
    }

    //Set state when the image url changes
    onChangeImage(e){
        this.setState({
            image: e.target.value
        });
    }

    //Set state when the email changes
    onChangeEmail(e){
        this.setState({
            email: e.target.value
        });
    }

    //Set state when the center changes
    onChangeCenter(e){
        //Need to save to the users collection
        console.log("Check",e.target.value);

        let checkCenter = this.state.newCenters.includes(e.target.value);

        if (checkCenter === false){
            this.state.newCenters.push(e.target.value);
            this.setState({
                newCenters: this.state.newCenters
            });
        }   
        console.log(this.state.newCenters);      
    }

    //Method to route to root when clicks cancel
    onCancel(e){
        //Prevent default submission
        e.preventDefault();

        //Send back to Users List
        window.location = '/';
    }

    //Method when click Save Changes button
    onSubmit(e){
        //Prevent default submission
        e.preventDefault();
        
        //Create user object to save
        const user = {
            name: this.state.name,
            skillLevel: this.state.skillLevel,
            image: this.state.image,
            email: this.state.email,
            centers: this.state.newCenters,
        }

        //Send to back-end to add the new user, look at routes/users.route.js
        axios.post(`${API_URL}/add`, user)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));

        //Clear the fields
        this.setState({
            name: "",
            skillLevel: "",
            image: "",
            email: ""
        })       
    }
    
    render(){
        return(
            <div>
                <h1>Create New User</h1>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>User Name</label>
                        <input type="text" className="form-control" value={this.state.name} onChange={this.onChangeName}></input>
                        <label>Skill Level</label>
                        <input type="text" className="form-control" value={this.state.skillLevel} onChange={this.onChangeSkillLevel}></input>
                        <label>Image</label>
                        <input type="text" className="form-control" value={this.state.image} onChange={this.onChangeImage}></input>
                        <label>Email</label>
                        <input type="text" className="form-control" value={this.state.email} onChange={this.onChangeEmail}></input>
                        <label>Select Affiliated Centers</label>
                        {/* Loop over the Centers and display */}
                        {this.state.centers.map(center =>
                            <div key={`div1${center._id}`} className="input-group mb-3">
                                <div key={`div2${center._id}`} className="input-group-prepend">
                                    <div key={`div3${center._id}`} className="input-group-text">
                                        <input key={center._id} type="checkbox" value={center.centerName} onChange={this.onChangeCenter}/>
                                    </div>
                                </div>
                                <input key={`text${center._id}`} type="text" disabled className="form-control" defaultValue={center.centerName}/>
                            </div>
                        )}
 
                        
                    </div>
                    <button className="btn btn-primary" type="submit" style={styleBtn}>Add User</button>
                    <button className="btn btn-warning" type="button" onClick={this.onCancel}>Cancel</button>
                </form>
            </div>
        )
    }
}