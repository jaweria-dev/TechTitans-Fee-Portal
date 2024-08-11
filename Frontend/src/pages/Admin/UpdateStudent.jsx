import React, { useState, useEffect } from "react";
import AdminMenu from "./../../components/Layout/AdminMenu";
import AdminHeader from "../../components/Layout/AdminHeader";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../components/context/Context";
const { Option } = Select;

const UpdateStudent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [teacher, setTeacher] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");
  const [auth] = useAuth();

  //get single student
  const getSingleStudent = async () => {
    try {
      if (photo && photo.size > 1024 * 1024) {
        toast.error("The uploaded photo should be less than 1 MB.");
        return;
      }
      const { data } = await axios.get(
        `https://tech-titans-fee-portal.vercel.app/api/fee/portal/students/get-student/${params.slug}`
      );
      setName(data.student.name);
      setId(data.student._id);
      setEmail(data.student.email);
      setPhone(data.student.phone);
      setRollNo(data.student.rollNo);
      setBatchNo(data.student.batchNo);
      setPassword(data.student.password);
      setAnswer(data.student.answer);
      setTeacher(data.student.teacher._id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleStudent();
    //eslint-disable-next-line
  }, []);

  //get all teacher
  const getAllTeacher = async () => {
    try {
      const { data } = await axios.get(
        "https://tech-titans-fee-portal.vercel.app/api/fee/portal/teacher/get-teacher"
      );
      if (data?.success) {
        setTeachers(data?.teacher);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting teacher");
    }
  };

  useEffect(() => {
    getAllTeacher();
  }, []);

  

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const studentData = new FormData();
      studentData.append("name", name);
      studentData.append("email", email);
      studentData.append("phone", phone);
      studentData.append("password", password);
      studentData.append("rollNo", rollNo); 
      studentData.append("batchNo", batchNo); 
      studentData.append("answer", answer);
      if (photo) {
        studentData.append("photo", photo);
      }
      studentData.append("teacher", teacher);

     
      const { data } = await axios.put(
        `https://tech-titans-fee-portal.vercel.app/api/fee/portal/students/update-student/${id}`,
        studentData,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        toast.success("Student Updated Successfully!");
        navigate("/dashboard/admin/students");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Something went wrong");
    }
  };

  //delete a product
  const handleDelete = async () => {
    try {
      let answer = window.prompt("Are You Sure want to delete this student ? ");
      if (!answer) return;
      const { data } = await axios.delete(
        `https://tech-titans-fee-portal.vercel.app/api/fee/portal/students/delete-student/${id}`
      );
      toast.success("Student Deleted Succfully");
      navigate("/dashboard/admin/students");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const [openMenuToggle, setOpenMenuToggle] = useState(false);

  useEffect(() => {
    console.log("Sidebar toggle state:", openMenuToggle);
  }, [openMenuToggle]);

  const OpenMenu = () => {
    setOpenMenuToggle(!openMenuToggle);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu openMenuToggle={openMenuToggle} OpenMenu={OpenMenu} />
        </div>
        <div className="col-md-9">
          <AdminHeader OpenMenu={OpenMenu} />
          <h1>Update Student</h1>
          <div className="m-1 w-98">
            <Select
              bordered={false}
              variant="unstyled"
              placeholder="Update a teacher"
              size="large"
              showSearch
              className="form-select mb-3"
              onChange={(value) => {
                setTeacher(value);
              }}
              value={teachers}
            >
              {teachers?.map((t) => (
                <Option key={t._id} value={t._id}>
                  {t.name}
                </Option>
              ))}
            </Select>
            <div className="mb-3">
              <label className="btn1 btn-outline-secondary col-md-12">
                {photo ? photo.name : "Upload Photo"}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                />
              </label>
            </div>
            <div className="mb-3">
              {photo ? (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="student_photo"
                    height={"200px"}
                    width={"200px"}
                    className="img img-responsive"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <img
                    src={`https://tech-titans-fee-portal.vercel.app/api/fee/portal/students/student-photo/${id}`}
                    alt="student_photo"
                    height={"200px"}
                    width={"200px"}
                    className="img img-responsive"
                  />
                </div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={name}
                placeholder="Enter Updated Name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                value={email}
                placeholder="Enter Updated Email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <input
                type="number"
                value={phone}
                placeholder="Enter Updated Phone Number"
                className="form-control"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                value={password}
                placeholder="Enter Password"
                className="form-control mt-2"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={answer}
                placeholder="What Is Your Favourite Game"
                className="form-control mt-2"
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                value={rollNo}
                placeholder="Enter Updated Roll No"
                className="form-control"
                onChange={(e) => setRollNo(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <Select
                bordered={false}
                placeholder="Select Batch "
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setBatchNo(value);
                }}
              >
                <Option value="0">9</Option>
                <Option value="1">10</Option>
                <Option value="1">11</Option>
                <Option value="1">12</Option>
              </Select>
            </div>
            <div className="mb-3">
              <button className="btn-primary" onClick={handleUpdate}>
                UPDATE STUDENT
              </button>
            </div>
            <div className="mb-3">
              <button className="btn-danger" onClick={handleDelete}>
                DELETE STUDENT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStudent;
