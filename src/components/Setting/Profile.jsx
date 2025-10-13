import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; // ✅ 캘린더 import
import "react-calendar/dist/Calendar.css"; // ✅ 기본 스타일 import
import "./Profile.css";
import axiosInstance from "../../api/authAxiosInstance";
import useAuthStore from "../../store/useAuthStore"; // ✅ zustand 전역 사용자 상태

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [originalData, setOriginalData] = useState({ name: "", birthDate: "" });

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { user, setUser } = useAuthStore(); // ✅ zustand에서 사용자 정보 가져오기

  // ✅ 사용자 정보 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          alert("로그인 정보가 없습니다.");
          window.location.href = "/";
          return;
        }

        const response = await axiosInstance.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = response.data.result;
        setUserId(data.userId);
        setEmail(data.email);
        setName(data.name);
        setBirthDate(data.birth);
        setOriginalData({ name: data.name, birthDate: data.birth });
      } catch (err) {
        console.error("프로필 불러오기 실패:", err);
        alert("프로필 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ 수정 모드 전환
  const handleEditClick = () => {
    setOriginalData({ name, birthDate });
    setIsEditing(true);
  };

  // ✅ 저장 (PATCH 요청)
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("로그인 정보가 없습니다.");
        window.location.href = "/";
        return;
      }

      // 🔹 유효성 검사
      if (newPassword && !currentPassword) {
        alert("현재 비밀번호를 입력해야 비밀번호를 변경할 수 있습니다.");
        return;
      }

      // 🔹 요청 본문 생성 (Swagger 스펙 기반)
      const body = {
        name,
        birth: birthDate,
      };

      if (currentPassword.trim() && newPassword.trim()) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
        body.passwordChangeValid = true;
      } else {
        body.passwordChangeValid = false;
      }

      console.log("📦 PATCH body:", body);

      await axiosInstance.patch("/api/auth/profile", body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      alert("프로필이 성공적으로 수정되었습니다.");

      // ✅ 전역 상태 업데이트 → 헤더 닉네임 즉시 반영
      setUser({
        ...user,
        name,
        birth: birthDate,
      });

      // ✅ UI 상태 초기화
      setIsEditing(false);
      setCurrentPassword("");
      setNewPassword("");
      setOriginalData({ name, birthDate });
    } catch (err) {
      console.error("프로필 수정 실패:", err);
      alert(
        err.response?.data?.message || "프로필 수정 중 오류가 발생했습니다."
      );
    }
  };

  // ✅ 수정 취소
  const handleCancel = () => {
    setName(originalData.name);
    setBirthDate(originalData.birthDate);
    setIsEditing(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  // ✅ 날짜 선택 시 YYYY-MM-DD 형식으로 저장
  const handleDateSelect = (date) => {
    const formatted = date.toISOString().split("T")[0];
    setBirthDate(formatted);
    setShowCalendar(false);
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <>
      <h1>{isEditing ? "프로필 수정" : "내 프로필"}</h1>

      <form onSubmit={handleSave}>
        {/* 이름 */}
        <div className="form-group">
          <label htmlFor="name">이름</label>
          {isEditing ? (
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className="view-mode-text">{name}</p>
          )}
        </div>

        {/* 아이디 */}
        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          <p className="view-mode-text disabled">{userId}</p>
        </div>

        {/* 이메일 */}
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <p className="view-mode-text disabled">{email}</p>
        </div>

        {/* 생년월일 */}
        <div className="form-group birthdate-group">
          <label htmlFor="birthDate">생년월일</label>
          {isEditing ? (
            <div className="calendar-wrapper">
              <input
                type="text"
                id="birthDate"
                value={birthDate}
                readOnly
                placeholder="날짜를 선택하세요"
                onClick={() => setShowCalendar(!showCalendar)}
              />
              {showCalendar && (
                <div className="calendar-popup">
                  <Calendar
                    onChange={handleDateSelect}
                    value={birthDate ? new Date(birthDate) : new Date()}
                    maxDate={new Date()} // 미래 선택 불가
                    locale="ko-KR"
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="view-mode-text">{birthDate}</p>
          )}
        </div>

        {/* 비밀번호 변경 */}
        {isEditing && (
          <>
            <div className="form-group">
              <label htmlFor="currentPassword">현재 비밀번호 입력</label>
              <input
                type="password"
                id="currentPassword"
                placeholder="현재 비밀번호를 입력하세요"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">변경할 비밀번호 입력</label>
              <input
                type="password"
                id="newPassword"
                placeholder="변경할 비밀번호를 입력하세요"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </>
        )}

        {/* 버튼 영역 */}
        <div className="form-actions">
          {isEditing ? (
            <>
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                취소
              </button>
              <button type="submit" className="save-button">
                저장
              </button>
            </>
          ) : (
            <button
              type="button"
              className="edit-button"
              onClick={handleEditClick}
            >
              프로필 수정
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default Profile;
