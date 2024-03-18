import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default class ImageUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: "",
      responseMsg: {
        status: "",
        message: "",
        error: "",
      },
    };
  }

  // image onchange hander
  handleChange = (e) => {
    const imagesArray = [];

    for (let i = 0; i < e.target.files.length; i++) {
      this.fileValidate(e.target.files[i]);
      imagesArray.push(e.target.files[i]);
    }
    this.setState({
      image: imagesArray,
    });
  };

  // submit handler
  submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let i = 0; i < this.state.image.length; i++) {
      data.append("files[]", this.state.image[i]);
    }

    axios
      .post("http://127.0.0.1:5000/upload", data)
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          this.setState({
            responseMsg: {
              status: response.data.status,
              message: response.data.message,
            },
          });
          setTimeout(() => {
            this.setState({
              image: "",
              responseMsg: "",
            });
          }, 100000);

          document.querySelector("#imageForm").reset();
        }
        alert("Successfully Uploaded");
        toast.success("Successfully Uploaded");
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          console.log(error.response);
          if (error.response.status === 401) {
            alert("Invalid credentials");
          }
        }
      });
  };

  // file validation
  fileValidate = (file) => {
    if (file.type === "image/mp4") {
      this.setState({
        responseMsg: {
          error: "",
        },
      });
      return true;
    } else {
      this.setState({
        responseMsg: {
          error: "File type allowed only mp4",
        },
      });
      return false;
    }
  };

  render() {
    return (
      <div className="py-5">
        <div className="">
          <div className="col-lg-12">
            <form
              onSubmit={this.submitHandler}
              encType="multipart/form-data"
              id="imageForm"
            >
              <div className="">
                {this.state.responseMsg.status === "successs" ? (
                  <div className="">{this.state.responseMsg.message}</div>
                ) : this.state.responseMsg.status === "failed" ? (
                  <div className="">{this.state.responseMsg.message}</div>
                ) : (
                  ""
                )}
                <div className="">
                  <h4 className="">
                    React-JS and Python Flask Multiple Image Upload with
                    validation
                  </h4>
                </div>

                <div className="">
                  <div className="py-2">
                    <label htmlFor="images">Images</label>
                    <input
                      type="file"
                      name="image"
                      multiple
                      onChange={this.handleChange}
                      className=""
                    />
                    <span className="">{this.state.responseMsg.error}</span>
                  </div>
                </div>

                <div className="">
                  <button type="submit" className="btn">
                    Upload
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}