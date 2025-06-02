import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Recursive TreeNode Component
const TreeNode = ({ node, onUpdate, onDelete, highlightIds, openIds, scrollToId, onScrollHandled }) => {
  const [isOpen, setIsOpen] = useState(openIds[node.id] ?? true);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (scrollToId === node.id && nodeRef.current) {
      nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      onScrollHandled();
    }
  }, [scrollToId]);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="text-center p-2" ref={nodeRef}>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`inline-block p-2 border rounded-xl shadow-md transition-all duration-300 ${
          highlightIds.includes(node.id) ? "bg-yellow-200 border-yellow-500" : "bg-white"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="font-semibold">{node.name}</div>
          <div className="text-sm text-gray-600">{node.gender}</div>
          <div className="mt-1 space-x-1">
            <button onClick={toggleOpen} className="text-xs bg-blue-100 px-2 py-0.5 rounded">
              {isOpen ? "−" : "+"}
            </button>
            <button onClick={() => onUpdate(node)} className="text-xs bg-green-100 px-2 py-0.5 rounded">
              ✎
            </button>
            <button onClick={() => onDelete(node.id)} className="text-xs bg-red-100 px-2 py-0.5 rounded">
              🗑
            </button>
          </div>
        </div>

        {isOpen && node.children?.length > 0 && (
          <motion.div layout className="mt-2 flex justify-center space-x-4">
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                onUpdate={onUpdate}
                onDelete={onDelete}
                highlightIds={highlightIds}
                openIds={openIds}
                scrollToId={scrollToId}
                onScrollHandled={onScrollHandled}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Main Component
const FamilyTree = () => {
  const [family, setFamily] = useState({
    id: 1,
    name: "Root Person",
    gender: "Male",
    children: [
      {
        id: 2,
        name: "Child One",
        gender: "Female",
        children: [
          {
            id: 4,
            name: "Grandchild One",
            gender: "Male",
            children: [],
          },
        ],
      },
      {
        id: 3,
        name: "Child Two",
        gender: "Male",
        children: [],
      },
    ],
  });

  const [zoom, setZoom] = useState(1);
  const [highlightIds, setHighlightIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollToId, setScrollToId] = useState(null);
  const [openIds, setOpenIds] = useState({});

  const findAncestors = (node, targetId, path = []) => {
    if (node.id === targetId) return path.concat(node.id);
    for (const child of node.children || []) {
      const result = findAncestors(child, targetId, path.concat(node.id));
      if (result) return result;
    }
    return null;
  };

  const handleSearch = () => {
    const result = findAncestors(family, parseInt(searchTerm));
    if (result) {
      setHighlightIds(result);
      const newOpenIds = {};
      result.forEach((id) => (newOpenIds[id] = true));
      setOpenIds(newOpenIds);
      setScrollToId(parseInt(searchTerm));
    } else {
      setHighlightIds([]);
    }
  };

  const updateNode = (updatedNode) => {
    const name = prompt("Enter new name", updatedNode.name);
    if (!name) return;

    const updateRecursively = (node) => {
      if (node.id === updatedNode.id) {
        return { ...node, name };
      }
      return {
        ...node,
        children: node.children?.map(updateRecursively) || [],
      };
    };
    setFamily(updateRecursively(family));
  };

  const deleteNode = (idToDelete) => {
    const deleteRecursively = (node) => {
      return {
        ...node,
        children: node.children
          ?.filter((child) => child.id !== idToDelete)
          .map(deleteRecursively),
      };
    };
    setFamily(deleteRecursively(family));
  };

  const onScrollHandled = () => setScrollToId(null);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-2">Family Tree</h1>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="number"
          placeholder="Search by ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-3 py-1 rounded">
          Search
        </button>
        <button onClick={() => setHighlightIds([])} className="bg-gray-300 px-3 py-1 rounded">
          Clear
        </button>
        <div className="flex items-center space-x-2 ml-auto">
          <button onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))} className="bg-gray-200 px-2 py-1 rounded">
            Zoom Out
          </button>
          <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="bg-gray-200 px-2 py-1 rounded">
            Zoom In
          </button>
          <button onClick={() => setZoom(1)} className="bg-gray-200 px-2 py-1 rounded">
            Reset Zoom
          </button>
        </div>
      </div>

      <div className="relative w-full h-[80vh] overflow-auto border border-gray-300 rounded bg-white">
        <div
          className="origin-top-left transition-transform p-4"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            minWidth: "max-content",
          }}
        >
          <TreeNode
            node={family}
            onUpdate={updateNode}
            onDelete={deleteNode}
            highlightIds={highlightIds}
            openIds={openIds}
            scrollToId={scrollToId}
            onScrollHandled={onScrollHandled}
          />
        </div>
      </div>
    </div>
  );
};

export default FamilyTree;
