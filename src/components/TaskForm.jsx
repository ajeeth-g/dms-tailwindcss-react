import React, { useRef } from "react";
import Button from "./common/Button";
import { CalendarDays, FilePlus2, Link, Link2, User2 } from "lucide-react";

const TaskForm = () => {
  const modalRef = useRef(null);

  return (
    <>
      <div className="flex items-end justify-between gap-4 mb-8">
        <Button
          className="btn btn-success"
          icon={<FilePlus2 className="h-4 w-4" />}
          onClick={() => modalRef.current.showModal()}
          label="Create task"
        />
      </div>

      <dialog ref={modalRef} id="create-task" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-lg flex-1">Create Task</h3>
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost"
              onClick={() => modalRef.current.close()}
            >
              ✕
            </button>
          </div>
          <div className="divider"></div>

          <form>
            <div className="grid grid-cols-3 gap-1">
              {/* Left Side - Task Form */}
              <div className="col-span-2">
                <div className="max-h-[450px] overflow-y-auto min-h-0">
                  {/* Task Name */}
                  <input
                    type="text"
                    placeholder="Task Name"
                    className="input input-bordered input-md w-full mb-1"
                  />

                  {/* Task Description */}
                  <textarea
                    placeholder="Task Description..."
                    className="textarea textarea-bordered textarea-md w-full"
                  ></textarea>

                  {/* Fields Section */}
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    {/* Assignee */}
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <div className="flex items-center gap-1">
                        <User2 className="h-4 w-4" />
                        <lable className="text-xs">Assignee</lable>
                      </div>
                      <select className="select select-bordered select-sm w-full">
                        <option value="" disabled>
                          Select Person
                        </option>
                        <option value="Anees">Anees</option>
                        <option value="Related1">Related 1</option>
                      </select>
                    </div>

                    {/* Related To */}
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <div className="flex items-center gap-1">
                        <Link className="h-4 w-4" />
                        <lable className="text-xs">Related to</lable>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter related"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    {/* Start Date */}
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <lable className="text-xs">Start Date</lable>
                      </div>
                      <input
                        type="date"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    {/* End Date */}
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <lable className="text-xs">End Date</lable>
                      </div>
                      <input
                        type="date"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <lable className="text-xs">Completed</lable>
                      </div>
                      <input
                        type="date"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <lable className="text-xs">Reminder On</lable>
                      </div>
                      <input
                        type="date"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <lable className="text-xs">Reminder me On</lable>
                      </div>
                      <input
                        type="date"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="modal-action">
                    <button type="submit" className="btn btn-success">
                      Create Task
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Activity Section */}
              <div className="col-span-1 rounded-lg p-4 shadow-2xl max-h-[400px] overflow-y-auto min-h-0">
                <h2 className="text-base font-medium mb-3">Current Assigned Tasks</h2>

                <div className="relative border-dashed border-l-2 border-gray-600 pl-4 rounded">
                  {/* Task 1 */}
                  <div className="relative mb-6">
                    {/* Timeline Circle */}
                    <div className="absolute -left-6 top-0 w-4 h-4 bg-gray-600 rounded-full border-2 border-white"></div>

                    <div className="flex items-center space-x-3">
                      <img
                        src="data:image/jpeg;base64,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"
                        alt="John Doe"
                        className="h-8 w-8 rounded-full border"
                      />
                      <div>
                        <h3 className="text-sm font-semibold">Design UI</h3>
                        <p className="text-xs text-gray-500">John Doe</p>
                      </div>
                    </div>
                    <p className="text-xs mt-2 text-gray-600">
                      Created a UI for the dashboard.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Completed on: Jan 15, 2025 - 10:30 AM
                    </p>
                  </div>

                  {/* Task 2 */}
                  <div className="relative mb-6">
                    {/* Timeline Circle */}
                    <div className="absolute -left-6 top-2 w-4 h-4 bg-gray-600 rounded-full border-2 border-white"></div>

                    <div className="flex items-center space-x-3">
                      <img
                        src="data:image/jpeg;base64,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"
                        alt="Jane Smith"
                        className="h-8 w-8 rounded-full border"
                      />
                      <div>
                        <h3 className="text-sm font-semibold">
                          API Development
                        </h3>
                        <p className="text-xs text-gray-500">Jane Smith</p>
                      </div>
                    </div>
                    <p className="text-xs mt-2 text-gray-600">
                      Developed authentication API.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Completed on: Jan 14, 2025 - 02:15 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default TaskForm;
