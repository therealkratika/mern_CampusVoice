import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "../css/Dashboard.css";
import { ProfessorCard } from "../components/ProfessorCard";
import logo from "../assets/CampusVoice.png";

export default function Dashboard({
  user = {},
  college = {},
  subjects = [],
  branches = [],
  semesters = [],
  onViewProfessor = () => {},
  onLogout = () => {},
}) {
  const [professors, setProfessors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [activeTab, setActiveTab] = useState("top-rated");
  const [compareList, setCompareList] = useState([]);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [localSubjects, setLocalSubjects] = useState(subjects || []);
  const [localBranches, setLocalBranches] = useState(branches || []);
  const [localSemesters, setLocalSemesters] = useState(semesters || []);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const res = await axios.get("https://campusvoice-backend.onrender.com/api/professors");
        const raw = res.data || [];

        const normalized = raw.map((p) => {
          const id = p._id || p.id || (p._id && p._id.toString());
          const name = p.name || p.fullName || "";
          const subjectId = p.subjectId || (typeof p.subject === "string" ? p.subject : null);
          let subjectName = typeof p.subject === "string" ? p.subject : null;
          if (!subjectName && subjectId && Array.isArray(subjects) && subjects.length) {
            const found = subjects.find((s) => s.id === subjectId || s._id === subjectId);
            subjectName = found?.name || found?.label || subjectId;
          }
          subjectName = subjectName || p.subjectName || "";

          const rawBranches = p.branches || p.branchesTaught || [];
          const normalizedBranches = Array.isArray(rawBranches)
            ? rawBranches.map((b) => (typeof b === "string" ? b : b.code || b.id || b.name))
            : [];

          const rawSemesters = p.semesters || p.semestersTaught || [];
          const normalizedSemesters = Array.isArray(rawSemesters)
            ? rawSemesters.map((s) => (typeof s === "number" ? s.toString() : (s || "").toString()))
            : [];

          const averageRating =
            p.averageRating ||
            p.rating ||
            (Array.isArray(p.reviews) && p.reviews.length
              ? p.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / p.reviews.length
              : 0);

          const totalRatings = p.totalRatings || (Array.isArray(p.reviews) ? p.reviews.length : 0);

          return {
            ...p,
            id,
            name,
            subject: subjectName,
            subjectId: subjectId || subjectName || "",
            branches: normalizedBranches,
            semesters: normalizedSemesters,
            videos: p.videos || [],
            averageRating: Number(averageRating || 0),
            totalRatings: Number(totalRatings || 0),
          };
        });

        setProfessors(normalized);

        // Build local subjects if not passed from props
        if ((!subjects || subjects.length === 0) && normalized.length > 0) {
          const map = {};
          normalized.forEach((p) => {
            const sid = p.subjectId || p.subject || "unknown";
            if (!map[sid]) map[sid] = { id: sid, name: p.subject || sid, icon: "📚" };
          });
          setLocalSubjects(Object.values(map));
        } else {
          setLocalSubjects(subjects);
        }

        // Build local branches if not passed
        if ((!branches || branches.length === 0) && normalized.length > 0) {
          const bmap = {};
          normalized.forEach((p) => {
            (p.branches || []).forEach((b) => {
              const id = b || "other";
              if (!bmap[id]) bmap[id] = { id, code: id, icon: "🏷️" };
            });
          });
          setLocalBranches(Object.values(bmap));
        } else {
          setLocalBranches(branches);
        }

        // Build local semesters if not passed
        if ((!semesters || semesters.length === 0) && normalized.length > 0) {
          const smap = {};
          normalized.forEach((p) => {
            (p.semesters || []).forEach((s) => {
              const id = s || "";
              if (id && !smap[id]) {
                const label = /^\d+$/.test(id) ? `Sem ${id}` : id;
                smap[id] = { id, label };
              }
            });
          });
          const semList = Object.values(smap).sort((a, b) => {
            const an = parseInt(a.id, 10),
              bn = parseInt(b.id, 10);
            if (!isNaN(an) && !isNaN(bn)) return an - bn;
            return a.label.localeCompare(b.label);
          });
          setLocalSemesters(semList);
        } else {
          if (Array.isArray(semesters) && semesters.length > 0 && typeof semesters[0] === "string") {
            setLocalSemesters(semesters.map((s) => ({ id: s.toString(), label: s.toString() })));
          } else {
            setLocalSemesters(semesters);
          }
        }
      } catch (err) {
        console.error("Failed to fetch professors:", err);
      }
    };

    fetchProfessors();
  }, []); // eslint-disable-line

  // Filter professors based on search and filters
  const filteredProfessors = useMemo(() => {
    const searchLower = searchQuery.toLowerCase().trim();

    return professors.filter((prof) => {
      const matchesBranch =
        selectedBranch === "all" ||
        (Array.isArray(prof.branches) && prof.branches.includes(selectedBranch));

      const matchesSemester =
        selectedSemester === "all" ||
        (Array.isArray(prof.semesters) && prof.semesters.includes(selectedSemester));

      const matchesSubject =
        selectedSubject === "all" ||
        prof.subjectId === selectedSubject ||
        prof.subject === (localSubjects.find((s) => s.id === selectedSubject)?.name || selectedSubject);

      const profName = (prof.name || "").toLowerCase();
      const profSubject = (prof.subject || "").toLowerCase();

      const matchesSearch =
        !searchLower ||
        profName.includes(searchLower) ||
        profSubject.includes(searchLower);

      return matchesBranch && matchesSemester && matchesSubject && matchesSearch;
    });
  }, [professors, searchQuery, selectedBranch, selectedSemester, selectedSubject, localSubjects]);

  // Top rated professors (top 6)
  const topProfessors = useMemo(() => {
    return [...filteredProfessors]
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 6);
  }, [filteredProfessors]);

  // Get professors by subject
  const getSubjectProfessors = (subjectId) => {
    return filteredProfessors
      .filter(
        (p) =>
          p.subjectId === subjectId ||
          p.subject === (localSubjects.find((s) => s.id === subjectId)?.name || "")
      )
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  };

  // Stats based on all professors (not filtered)
  const stats = useMemo(() => {
    const profsInCollege = professors.filter((p) => (college?.id ? p.collegeId === college.id : true));
    const totalProfs = profsInCollege.length;
    const totalVideos = profsInCollege.reduce(
      (sum, p) => sum + (Array.isArray(p.videos) ? p.videos.length : 0),
      0
    );
    const averageRating =
      totalProfs > 0 ? profsInCollege.reduce((s, p) => s + (p.averageRating || 0), 0) / totalProfs : 0;
    return { totalProfessors: totalProfs, totalVideos, averageRating };
  }, [professors, college]);

  const toggleExpand = (subjectId) =>
    setExpandedSubjects((prev) => ({ ...prev, [subjectId]: !prev[subjectId] }));

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSubject("all");
    setSelectedBranch("all");
    setSelectedSemester("all");
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo-group">
            <img src={logo} alt="CampusVoice Logo" className="campuslogo" />
            <div className="header-container-2">
              <h1 className="logo">CampusVoice</h1>
              <p className="college-name">{college.name || "College"}</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="user-info">
              <span>Welcome, {user.name || "User "}</span>
              {user.branchId && user.semester && (
                <span>
                  {localBranches.find((b) => b.id === user.branchId)?.code} • Semester {user.semester}
                </span>
              )}
            </div>
            {compareList.length > 0 && (
              <button className="btn-outline" onClick={() => setIsCompareModalOpen(true)}>
                ⚖ Compare ({compareList.length})
              </button>
            )}
            <button className="btn-outline" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        {/* Stats */}
        <div className="stats-grid">
          <div className="card">
            <div className="stat">
              <div className="icon blue">📈</div>
              <div>
                <p className="stat-value">{stats.totalProfessors}</p>
                <p>Total Professors</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="stat">
              <div className="icon green">⭐</div>
              <div>
                <p className="stat-value">{stats.averageRating.toFixed(1)}</p>
                <p>Average Rating</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="stat">
              <div className="icon purple">📹</div>
              <div>
                <p className="stat-value">{stats.totalVideos}</p>
                <p>Total Videos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="card filters">
          <input
            type="text"
            className="search-input"
            placeholder="Search professors or subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search professors or subjects"
          />

          <div className="filter-grid">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              aria-label="Filter by branch"
            >
              <option value="all">All Branches</option>
              {localBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.icon ? `${branch.icon} ` : ""}
                  {branch.code || branch.name || branch.id}
                </option>
              ))}
            </select>

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              aria-label="Filter by semester"
            >
              <option value="all">All Semesters</option>
              {localSemesters.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  {sem.label || sem.id}
                </option>
              ))}
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              aria-label="Filter by subject"
            >
              <option value="all">All Subjects</option>
              {localSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.icon ? `${subject.icon} ` : ""}
                  {subject.name || subject.label || subject.id}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-outline clear-filters" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <div className="tabs-list" role="tablist" aria-label="Professor browsing tabs">
            <button
              className={activeTab === "top-rated" ? "tab active" : "tab"}
              onClick={() => setActiveTab("top-rated")}
              role="tab"
              aria-selected={activeTab === "top-rated"}
              tabIndex={activeTab === "top-rated" ? 0 : -1}
            >
              Top Rated Professors
            </button>
            <button
              className={activeTab === "by-subject" ? "tab active" : "tab"}
              onClick={() => setActiveTab("by-subject")}
              role="tab"
              aria-selected={activeTab === "by-subject"}
              tabIndex={activeTab === "by-subject" ? 0 : -1}
            >
              Browse by Subject
            </button>
          </div>
        </div>

        {/* Top Rated */}
        {activeTab === "top-rated" && (
          <div className="professors-grid" role="region" aria-label="Top rated professors">
            {topProfessors.length === 0 ? (
              <p>No professors found.</p>
            ) : (
              topProfessors.map((professor) => (
                <ProfessorCard
                  key={professor.id}
                  professor={professor}
                  onViewProfile={() => onViewProfessor(professor)}
                  onAddToCompare={() => handleAddToCompare(professor)}
                  isInCompareList={compareList.some((p) => p.id === professor.id)}
                />
              ))
            )}
          </div>
        )}

        {/* Browse by Subject */}
        {activeTab === "by-subject" && (
          <div role="region" aria-label="Browse professors by subject">
            {localSubjects.map((subject) => {
              const subjectProfessors = getSubjectProfessors(subject.id);
              if (!subjectProfessors || subjectProfessors.length === 0) return null;

              const isExpanded = expandedSubjects[subject.id];
              return (
                <div key={subject.id} className="subject-block">
                  <h3>
                    {subject.icon} {subject.name}{" "}
                    <span className="badge" aria-label={`${subjectProfessors.length} professors`}>
                      {subjectProfessors.length} profs
                    </span>
                  </h3>

                  <div className="professors-grid">
                    {(isExpanded ? subjectProfessors : subjectProfessors.slice(0, 3)).map((professor) => (
                      <ProfessorCard
                        key={professor.id}
                        professor={professor}
                        onViewProfile={() => onViewProfessor(professor)}
                        onAddToCompare={() => handleAddToCompare(professor)}
                        isInCompareList={compareList.some((p) => p.id === professor.id)}
                      />
                    ))}
                  </div>

                  {subjectProfessors.length > 3 && (
                    <button className="btn-outline" onClick={() => toggleExpand(subject.id)}>
                      {isExpanded ? "See Less" : "See More"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Compare Floating Box */}
        {compareList.length > 0 && (
          <div className="compare-box" role="complementary" aria-label="Compare professors list">
            <div className="compare-header">
              <h4>Compare List ({compareList.length}/3)</h4>
              <button onClick={() => setCompareList([])} aria-label="Clear compare list">
                ×
              </button>
            </div>
            <ul>
              {compareList.map((prof) => (
                <li key={prof.id}>
                  {prof.name}{" "}
                  <button
                    onClick={() => handleRemoveFromCompare(prof.id)}
                    aria-label={`Remove ${prof.name} from compare list`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <button
              disabled={compareList.length < 2}
              onClick={() => setIsCompareModalOpen(true)}
              aria-disabled={compareList.length < 2}
            >
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
