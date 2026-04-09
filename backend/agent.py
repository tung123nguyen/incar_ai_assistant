from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from car_state import car_state

@tool
def turn_on_ac() -> str:
    """Bật điều hoà."""
    car_state.state.ac.is_on = True
    return "Đã bật điều hoà."

@tool
def turn_off_ac() -> str:
    """Tắt điều hoà."""
    car_state.state.ac.is_on = False
    return "Đã tắt điều hoà."

@tool
def set_ac_temperature(temperature: float) -> str:
    """Cài đặt nhiệt độ điều hoà (từ 16 đến 30)."""
    car_state.state.ac.temperature = temperature
    return f"Đã đặt nhiệt độ điều hoà ở mức {temperature}°C."

@tool
def get_ac_temperature() -> str:
    """Lấy trạng thái và nhiệt độ điều hoà hiện tại."""
    return f"Trạng thái điều hoà: {'Bật' if car_state.state.ac.is_on else 'Tắt'}, Nhiệt độ: {car_state.state.ac.temperature}°C."

@tool
def get_tire_pressure() -> str:
    """Lấy thông tin áp suất lốp xe. Ngưỡng thấp là dươí 2.1 bar."""
    tires = car_state.state.tires
    status = []
    if tires.front_left < 2.1: status.append(f"trước trái thấp ({tires.front_left} bar)")
    if tires.front_right < 2.1: status.append(f"trước phải thấp ({tires.front_right} bar)")
    if tires.rear_left < 2.1: status.append(f"sau trái thấp ({tires.rear_left} bar)")
    if tires.rear_right < 2.1: status.append(f"sau phải thấp ({tires.rear_right} bar)")
    
    msg = f"Áp suất lốp: Trước trái {tires.front_left}, Trước phải {tires.front_right}, Sau trái {tires.rear_left}, Sau phải {tires.rear_right}."
    if status:
        msg += " Cảnh báo lốp: " + ", ".join(status)
    return msg

@tool
def turn_on_lights() -> str:
    """Bật đèn xe."""
    car_state.state.lights.is_on = True
    return "Đã bật đèn xe."

@tool
def turn_off_lights() -> str:
    """Tắt đèn xe."""
    car_state.state.lights.is_on = False
    return "Đã tắt đèn xe."

@tool
def get_light_status() -> str:
    """Lấy trạng thái đèn xe."""
    return "Đèn xe đang bật." if car_state.state.lights.is_on else "Đèn xe đang tắt."

@tool
def lock_doors() -> str:
    """Khoá cửa xe."""
    car_state.state.doors.is_locked = True
    return "Đã khoá cửa xe."

@tool
def unlock_doors() -> str:
    """Mở khoá cửa xe."""
    car_state.state.doors.is_locked = False
    return "Đã mở khoá cửa xe."

@tool
def get_door_status() -> str:
    """Lấy trạng thái cửa xe."""
    return "Cửa xe đang khoá." if car_state.state.doors.is_locked else "Cửa xe đang mở."

tools = [
    turn_on_ac, turn_off_ac, set_ac_temperature, get_ac_temperature,
    get_tire_pressure, turn_on_lights, turn_off_lights, get_light_status,
    lock_doors, unlock_doors, get_door_status
]

system_message = """Bạn là trợ lý AI thông minh trên ô tô VinFast. 
Bạn có thể điều khiển xe (điều hoà, áp suất lốp, đèn, cửa) qua các tools chuyên dụng và trò chuyện thân thiện bằng tiếng Việt.
Yêu cầu bắt buộc:
1. Không gọi tool nếu người dùng chỉ hỏi thăm thông thường (small talk).
2. LUÔN LUÔN gọi tool tương ứng khi người dùng yêu cầu điều khiển xe, để thực thi thao tác hoặc lấy để thông tin.
3. KHÔNG tự đoán trạng thái xe (không tự chế ra thông số nếu chưa gọi tool kiểm tra).
4. Sau khi gọi tool thành công hoặc kiểm tra thông tin thành công, hãy gộp mọi thứ vào một câu trả lời duy nhất ngắn gọn tự nhiên để thông báo cho người dùng (ví dụ: "Đã bật điều hoà cho bạn. Nhiệt độ đang ở mức 22°C.").
"""

# Khởi tạo mô hình
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Bộ nhớ hỗ trợ ghi nhớ ngữ cảnh chat cục bộ
memory = MemorySaver()
config = {"configurable": {"thread_id": "car_session_001"}}

agent_executor = create_react_agent(
    model=llm,
    tools=tools,
    prompt=system_message,
    checkpointer=memory
)

def chat_with_agent(message: str) -> str:
    response = agent_executor.invoke({"messages": [HumanMessage(content=message)]}, config)
    return response["messages"][-1].content
